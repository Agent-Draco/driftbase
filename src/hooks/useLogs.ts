import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SleepoverLog {
  id: string;
  sleepover_id: string;
  notes: string | null;
  highlights: string[];
  created_by: string | null;
  created_at: string;
  sleepover?: {
    id: string;
    title: string;
    event_date: string;
    location: string | null;
  };
  creator?: {
    display_name: string | null;
    username: string | null;
  };
}

export function useLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<SleepoverLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('sleepover_logs')
      .select(`
        *,
        sleepover:sleepover_id (id, title, event_date, location),
        creator:created_by (display_name, username)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLogs(data as SleepoverLog[]);
    }
    setLoading(false);
  };

  const createLog = async (sleepoverId: string, notes?: string, highlights?: string[]) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('sleepover_logs')
      .insert({
        sleepover_id: sleepoverId,
        notes: notes || null,
        highlights: highlights || [],
        created_by: user.id,
      })
      .select(`
        *,
        sleepover:sleepover_id (id, title, event_date, location),
        creator:created_by (display_name, username)
      `)
      .single();

    if (!error && data) {
      setLogs(prev => [data as SleepoverLog, ...prev]);
    }

    return { data, error };
  };

  const updateLog = async (id: string, notes?: string, highlights?: string[]) => {
    const { error } = await supabase
      .from('sleepover_logs')
      .update({ notes, highlights })
      .eq('id', id);

    if (!error) {
      await fetchLogs();
    }

    return { error };
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    loading,
    createLog,
    updateLog,
    fetchLogs,
  };
}
