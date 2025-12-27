import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Tradition {
  id: string;
  name: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
  creator?: {
    display_name: string | null;
    username: string | null;
  };
}

export function useTraditions() {
  const { user } = useAuth();
  const [traditions, setTraditions] = useState<Tradition[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTraditions = async () => {
    const { data, error } = await supabase
      .from('traditions')
      .select(`
        *,
        creator:created_by (display_name, username)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTraditions(data as Tradition[]);
    }
    setLoading(false);
  };

  const createTradition = async (name: string, description?: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('traditions')
      .insert({
        name,
        description: description || null,
        created_by: user.id,
      })
      .select(`
        *,
        creator:created_by (display_name, username)
      `)
      .single();

    if (!error && data) {
      setTraditions(prev => [data as Tradition, ...prev]);
    }

    return { data, error };
  };

  useEffect(() => {
    fetchTraditions();
  }, []);

  return {
    traditions,
    loading,
    createTradition,
    fetchTraditions,
  };
}
