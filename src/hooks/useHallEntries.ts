import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  type: 'fame' | 'shame';
  created_by: string | null;
  created_at: string;
}

export interface HallEntry {
  id: string;
  sleepover_id: string;
  achievement_id: string;
  winner_id: string;
  description: string | null;
  type: 'fame' | 'shame';
  created_by: string | null;
  created_at: string;
  sleepovers?: {
    id: string;
    title: string;
    event_date: string;
    year: number;
  } | null;
  achievements?: {
    id: string;
    name: string;
    description: string | null;
    icon: string;
    type: string;
  } | null;
  winner?: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export function useHallEntries(type: 'fame' | 'shame') {
  const [entries, setEntries] = useState<HallEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch hall entries
      const { data: entriesData } = await supabase
        .from('hall_entries')
        .select(`
          *,
          sleepovers:sleepover_id (
            id,
            title,
            event_date,
            year
          ),
          achievements:achievement_id (
            id,
            name,
            description,
            icon,
            type
          )
        `)
        .eq('type', type)
        .order('created_at', { ascending: false });

      if (entriesData) {
        // Fetch winner profiles separately
        const winnerIds = [...new Set(entriesData.map(e => e.winner_id))];
        const { data: winnersData } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url')
          .in('id', winnerIds);

        const winnersMap = new Map(winnersData?.map(w => [w.id, w]) || []);
        
        const entriesWithWinners = entriesData.map(entry => ({
          ...entry,
          winner: winnersMap.get(entry.winner_id) || null
        }));
        
        setEntries(entriesWithWinners as unknown as HallEntry[]);
      }

      // Fetch achievements of this type
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
        .eq('type', type)
        .order('name', { ascending: true });

      if (achievementsData) {
        setAchievements(achievementsData as Achievement[]);
      }

      setLoading(false);
    };

    fetchData();
  }, [user, type]);

  const createAchievement = async (achievement: Omit<Achievement, 'id' | 'created_at' | 'created_by'>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('achievements')
      .insert({
        ...achievement,
        created_by: user.id
      })
      .select()
      .single();

    if (!error && data) {
      setAchievements(prev => [...prev, data as Achievement]);
    }

    return { data, error };
  };

  const createEntry = async (entry: {
    sleepover_id: string;
    achievement_id: string;
    winner_id: string;
    description?: string;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('hall_entries')
      .insert({
        ...entry,
        type,
        created_by: user.id
      })
      .select(`
        *,
        sleepovers:sleepover_id (
          id,
          title,
          event_date,
          year
        ),
        achievements:achievement_id (
          id,
          name,
          description,
          icon,
          type
        )
      `)
      .single();

    if (!error && data) {
      // Fetch winner profile
      const { data: winnerData } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .eq('id', entry.winner_id)
        .single();

      const entryWithWinner = {
        ...data,
        winner: winnerData
      };
      
      setEntries(prev => [entryWithWinner as unknown as HallEntry, ...prev]);
    }

    return { data, error };
  };

  // Group entries by year and sleepover
  const entriesByYear = entries.reduce((acc, entry) => {
    const year = entry.sleepovers?.year || new Date(entry.created_at).getFullYear();
    if (!acc[year]) acc[year] = {};
    
    const sleepoverId = entry.sleepover_id;
    if (!acc[year][sleepoverId]) {
      acc[year][sleepoverId] = {
        sleepover: entry.sleepovers,
        entries: []
      };
    }
    acc[year][sleepoverId].entries.push(entry);
    
    return acc;
  }, {} as Record<number, Record<string, { sleepover: HallEntry['sleepovers']; entries: HallEntry[] }>>);

  return { entries, entriesByYear, achievements, loading, createAchievement, createEntry };
}
