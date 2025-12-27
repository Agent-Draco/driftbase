import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface PrivateMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  sender?: {
    id: string;
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  recipient?: {
    id: string;
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerAvatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export function usePrivateMessages(partnerId?: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!user || !partnerId) return;

    const { data, error } = await supabase
      .from('private_messages')
      .select(`
        *,
        sender:profiles!private_messages_sender_id_fkey (id, display_name, username, avatar_url),
        recipient:profiles!private_messages_recipient_id_fkey (id, display_name, username, avatar_url)
      `)
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data as unknown as PrivateMessage[]);
      // Mark messages as read
      await supabase
        .from('private_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('recipient_id', user.id)
        .eq('sender_id', partnerId)
        .is('read_at', null);
    }
    setLoading(false);
  }, [user, partnerId]);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    // Get all messages involving this user
    const { data, error } = await supabase
      .from('private_messages')
      .select(`
        *,
        sender:profiles!private_messages_sender_id_fkey (id, display_name, username, avatar_url),
        recipient:profiles!private_messages_recipient_id_fkey (id, display_name, username, avatar_url)
      `)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const typedData = data as unknown as PrivateMessage[];
      // Group by conversation partner
      const conversationMap = new Map<string, Conversation>();
      
      for (const msg of typedData) {
        const isFromMe = msg.sender_id === user.id;
        const partner = isFromMe ? msg.recipient : msg.sender;
        const partnerIdVal = isFromMe ? msg.recipient_id : msg.sender_id;

        if (!conversationMap.has(partnerIdVal)) {
          // Count unread messages from this partner
          const unreadCount = typedData.filter(
            m => m.sender_id === partnerIdVal && m.recipient_id === user.id && !m.read_at
          ).length;

          conversationMap.set(partnerIdVal, {
            partnerId: partnerIdVal,
            partnerName: partner?.display_name || partner?.username || 'Unknown',
            partnerAvatar: partner?.avatar_url || null,
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
            unreadCount,
          });
        }
      }

      setConversations(Array.from(conversationMap.values()));
    }
    setLoading(false);
  }, [user]);

  const sendMessage = async (recipientId: string, content: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('private_messages')
      .insert({
        sender_id: user.id,
        recipient_id: recipientId,
        content,
      })
      .select(`
        *,
        sender:profiles!private_messages_sender_id_fkey (id, display_name, username, avatar_url),
        recipient:profiles!private_messages_recipient_id_fkey (id, display_name, username, avatar_url)
      `)
      .single();

    if (!error && data) {
      setMessages(prev => [...prev, data as unknown as PrivateMessage]);
    }

    return { data, error };
  };

  useEffect(() => {
    if (partnerId) {
      fetchMessages();
    } else {
      fetchConversations();
    }
  }, [partnerId, fetchMessages, fetchConversations]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('private-messages-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'private_messages' },
        (payload) => {
          const newMsg = payload.new as any;
          if (newMsg.sender_id === user.id || newMsg.recipient_id === user.id) {
            if (partnerId) {
              fetchMessages();
            } else {
              fetchConversations();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, partnerId, fetchMessages, fetchConversations]);

  return {
    messages,
    conversations,
    loading,
    sendMessage,
    fetchMessages,
    fetchConversations,
  };
}
