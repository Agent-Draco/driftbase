import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Sleepover {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  event_date: string;
  year: number;
  created_by: string | null;
  created_at: string;
}

export interface RSVP {
  id: string;
  sleepover_id: string;
  user_id: string;
  status: 'confirmed' | 'declined' | 'pending';
  created_at: string;
  profiles?: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export function useSleepovers() {
  const [sleepovers, setSleepovers] = useState<Sleepover[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchSleepovers = async () => {
      const { data, error } = await supabase
        .from('sleepovers')
        .select('*')
        .order('event_date', { ascending: false });

      if (!error && data) {
        setSleepovers(data as Sleepover[]);
      }
      setLoading(false);
    };

    fetchSleepovers();
  }, [user]);

  const createSleepover = async (sleepover: Omit<Sleepover, 'id' | 'year' | 'created_at' | 'created_by'>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('sleepovers')
      .insert({
        ...sleepover,
        created_by: user.id
      })
      .select()
      .single();

    if (!error && data) {
      setSleepovers(prev => [data as Sleepover, ...prev]);
    }

    return { data, error };
  };

  const getRsvps = async (sleepoverId: string): Promise<RSVP[]> => {
    const { data } = await supabase
      .from('rsvps')
      .select(`
        *,
        profiles:user_id (
          id,
          display_name,
          avatar_url
        )
      `)
      .eq('sleepover_id', sleepoverId);

    return (data || []) as RSVP[];
  };

  const updateRsvp = async (sleepoverId: string, status: 'confirmed' | 'declined' | 'pending') => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('rsvps')
      .upsert({
        sleepover_id: sleepoverId,
        user_id: user.id,
        status
      }, {
        onConflict: 'sleepover_id,user_id'
      });

    return { error };
  };

  // Group sleepovers by year
  const sleepoversByYear = sleepovers.reduce((acc, sleepover) => {
    const year = sleepover.year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(sleepover);
    return acc;
  }, {} as Record<number, Sleepover[]>);

  return { sleepovers, sleepoversByYear, loading, createSleepover, getRsvps, updateRsvp };
}
