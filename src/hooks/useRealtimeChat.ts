import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  profiles?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export function useRealtimeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:sender_id (
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: true })
        .limit(100);

      if (!error && data) {
        setMessages(data as Message[]);
      }
      setLoading(false);
    };

    fetchMessages();

    // Set up realtime subscription
    channelRef.current = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          // Fetch the profile for the new message
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, username, display_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();

          const newMessage = {
            ...payload.new,
            profiles: profile
          } as Message;

          setMessages(prev => [...prev, newMessage]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          setMessages(prev => prev.filter(m => m.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user]);

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return { error: new Error('Invalid message') };

    const { error } = await supabase
      .from('messages')
      .insert({
        content: content.trim(),
        sender_id: user.id
      });

    return { error };
  };

  const deleteMessage = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    return { error };
  };

  return { messages, loading, sendMessage, deleteMessage };
}
