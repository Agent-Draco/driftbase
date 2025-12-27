import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SleepoverLog {
  id: string;
  sleepover_id: string;
  title: string;
  content: string | null;
  highlights: string[] | null;
  created_by: string | null;
  created_at: string | null;
  sleepover?: {
    id: string;
    title: string;
    event_date: string;
    location: string | null;
  };
  creator?: {
    display_name: string;
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
        creator:created_by (display_name)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLogs(data as unknown as SleepoverLog[]);
    }
    setLoading(false);
  };

  const createLog = async (sleepoverId: string, title: string, content?: string, highlights?: string[]) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('sleepover_logs')
      .insert({
        sleepover_id: sleepoverId,
        title,
        content: content || null,
        highlights: highlights || [],
        created_by: user.id,
      })
      .select(`
        *,
        sleepover:sleepover_id (id, title, event_date, location),
        creator:created_by (display_name)
      `)
      .single();

    if (!error && data) {
      setLogs(prev => [data as unknown as SleepoverLog, ...prev]);
    }

    return { data, error };
  };

  const updateLog = async (id: string, title: string, content?: string, highlights?: string[]) => {
    const { error } = await supabase
      .from('sleepover_logs')
      .update({ title, content, highlights })
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