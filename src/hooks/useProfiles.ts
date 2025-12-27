import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  status: 'online' | 'away' | 'offline';
  created_at: string;
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('display_name', { ascending: true });

      if (!error && data) {
        setProfiles(data as Profile[]);
      }
      setLoading(false);
    };

    fetchProfiles();

    // Subscribe to profile changes
    const channel = supabase
      .channel('profiles-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProfiles(prev => [...prev, payload.new as Profile]);
          } else if (payload.eventType === 'UPDATE') {
            setProfiles(prev => 
              prev.map(p => p.id === payload.new.id ? payload.new as Profile : p)
            );
          } else if (payload.eventType === 'DELETE') {
            setProfiles(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const onlineProfiles = profiles.filter(p => p.status === 'online');
  
  return { profiles, onlineProfiles, loading };
}
