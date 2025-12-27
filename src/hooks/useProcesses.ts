import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Process {
  id: string;
  name: string;
  steps: string[];
  created_by: string | null;
  created_at: string;
  creator?: {
    display_name: string | null;
    username: string | null;
  };
}

export function useProcesses() {
  const { user } = useAuth();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProcesses = async () => {
    const { data, error } = await supabase
      .from('processes')
      .select(`
        *,
        creator:created_by (display_name, username)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProcesses(data as Process[]);
    }
    setLoading(false);
  };

  const createProcess = async (name: string, steps: string[]) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('processes')
      .insert({
        name,
        steps,
        created_by: user.id,
      })
      .select(`
        *,
        creator:created_by (display_name, username)
      `)
      .single();

    if (!error && data) {
      setProcesses(prev => [data as Process, ...prev]);
    }

    return { data, error };
  };

  const updateProcess = async (id: string, name: string, steps: string[]) => {
    const { error } = await supabase
      .from('processes')
      .update({ name, steps })
      .eq('id', id);

    if (!error) {
      await fetchProcesses();
    }

    return { error };
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  return {
    processes,
    loading,
    createProcess,
    updateProcess,
    fetchProcesses,
  };
}
