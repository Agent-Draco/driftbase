import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface VoiceRoom {
  id: string;
  name: string;
  created_by: string | null;
  is_active: boolean;
  created_at: string;
}

interface RoomParticipant {
  id: string;
  room_id: string;
  user_id: string;
  is_muted: boolean;
  joined_at: string;
  profiles?: {
    id: string;
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export function useVoiceRooms() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<VoiceRoom[]>([]);
  const [participants, setParticipants] = useState<Record<string, RoomParticipant[]>>({});
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from('voice_rooms')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRooms(data);
      // Fetch participants for each room
      for (const room of data) {
        await fetchParticipants(room.id);
      }
    }
    setLoading(false);
  };

  const fetchParticipants = async (roomId: string) => {
    const { data, error } = await supabase
      .from('voice_room_participants')
      .select(`
        *,
        profiles:user_id (id, display_name, username, avatar_url)
      `)
      .eq('room_id', roomId);

    if (!error && data) {
      setParticipants(prev => ({ ...prev, [roomId]: data as RoomParticipant[] }));
    }
  };

  const createRoom = async (name: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('voice_rooms')
      .insert({ name, created_by: user.id })
      .select()
      .single();

    if (!error && data) {
      setRooms(prev => [data, ...prev]);
    }

    return { data, error };
  };

  const joinRoom = useCallback(async (roomId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      setLocalStream(stream);

      // Join the room in database
      const { error } = await supabase
        .from('voice_room_participants')
        .insert({ room_id: roomId, user_id: user.id, is_muted: false });

      if (error) {
        stream.getTracks().forEach(track => track.stop());
        return { error };
      }

      setCurrentRoom(roomId);
      setIsMuted(false);
      await fetchParticipants(roomId);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }, [user]);

  const leaveRoom = useCallback(async () => {
    if (!user || !currentRoom) return;

    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    await supabase
      .from('voice_room_participants')
      .delete()
      .eq('room_id', currentRoom)
      .eq('user_id', user.id);

    const roomId = currentRoom;
    setCurrentRoom(null);
    await fetchParticipants(roomId);
  }, [user, currentRoom, localStream]);

  const toggleMute = useCallback(async () => {
    if (!user || !currentRoom || !localStream) return;

    const newMuted = !isMuted;
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !newMuted;
    });

    await supabase
      .from('voice_room_participants')
      .update({ is_muted: newMuted })
      .eq('room_id', currentRoom)
      .eq('user_id', user.id);

    setIsMuted(newMuted);
  }, [user, currentRoom, isMuted, localStream]);

  useEffect(() => {
    fetchRooms();

    // Subscribe to room changes
    const roomsChannel = supabase
      .channel('voice-rooms-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'voice_rooms' }, () => {
        fetchRooms();
      })
      .subscribe();

    // Subscribe to participant changes
    const participantsChannel = supabase
      .channel('voice-participants-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'voice_room_participants' }, (payload) => {
        const roomId = (payload.new as any)?.room_id || (payload.old as any)?.room_id;
        if (roomId) {
          fetchParticipants(roomId);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(roomsChannel);
      supabase.removeChannel(participantsChannel);
      // Cleanup on unmount
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Cleanup when user leaves page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentRoom && user) {
        navigator.sendBeacon(`/api/leave-room?room=${currentRoom}&user=${user.id}`);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentRoom, user]);

  return {
    rooms,
    participants,
    currentRoom,
    isMuted,
    loading,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleMute,
    fetchRooms,
  };
}
