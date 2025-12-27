import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Json } from '@/integrations/supabase/types';

interface Process {
  id: string;
  title: string;
  icon: string | null;
  steps: string[];
  created_by: string | null;
  created_at: string | null;
  creator?: {
    display_name: string;
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
        creator:created_by (display_name)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mapped = data.map(p => ({
        ...p,
        steps: Array.isArray(p.steps) ? p.steps as string[] : []
      }));
      setProcesses(mapped as unknown as Process[]);
    }
    setLoading(false);
  };

  const createProcess = async (title: string, steps: string[], icon?: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('processes')
      .insert({
        title,
        steps: steps as unknown as Json,
        icon: icon || '📋',
        created_by: user.id,
      })
      .select(`
        *,
        creator:created_by (display_name)
      `)
      .single();

    if (!error && data) {
      const mapped = {
        ...data,
        steps: Array.isArray(data.steps) ? data.steps as string[] : []
      };
      setProcesses(prev => [mapped as unknown as Process, ...prev]);
    }

    return { data, error };
  };

  const updateProcess = async (id: string, title: string, steps: string[], icon?: string) => {
    const { error } = await supabase
      .from('processes')
      .update({ title, steps: steps as unknown as Json, icon })
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