import { useState, useRef, useEffect, useCallback } from 'react';

interface VoiceRoom {
  id: string;
  name: string;
  participants: string[];
}

interface PeerConnection {
  peerId: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

export function useVoiceChat() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      localStreamRef.current = stream;
      return stream;
    } catch (err) {
      setError('Could not access microphone');
      throw err;
    }
  };

  const stopLocalStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      await startLocalStream();
      setIsConnected(true);
      // In a full implementation, this would connect to a signaling server
      // For now, we'll just set the connected state
    } catch (err) {
      console.error('Failed to join room:', err);
    }
  };

  const leaveRoom = () => {
    stopLocalStream();
    audioElementsRef.current.forEach(audio => {
      audio.pause();
      audio.srcObject = null;
    });
    audioElementsRef.current.clear();
    setIsConnected(false);
    setParticipants([]);
  };

  useEffect(() => {
    return () => {
      leaveRoom();
    };
  }, []);

  return {
    isConnected,
    isMuted,
    participants,
    error,
    joinRoom,
    leaveRoom,
    toggleMute,
  };
}
