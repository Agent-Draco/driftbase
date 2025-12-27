import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Sleepover {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  event_date: string;
  created_by: string | null;
  created_at: string | null;
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

  const createSleepover = async (sleepover: Omit<Sleepover, 'id' | 'created_at' | 'created_by'>) => {
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

  const deleteSleepover = async (sleepoverId: string) => {
    const { error } = await supabase
      .from('sleepovers')
      .delete()
      .eq('id', sleepoverId);

    if (!error) {
      setSleepovers(prev => prev.filter(s => s.id !== sleepoverId));
    }

    return { error };
  };

  // Group sleepovers by year
  const sleepoversByYear = sleepovers.reduce((acc, sleepover) => {
    const year = new Date(sleepover.event_date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(sleepover);
    return acc;
  }, {} as Record<number, Sleepover[]>);

  return { sleepovers, sleepoversByYear, loading, createSleepover, deleteSleepover };
}