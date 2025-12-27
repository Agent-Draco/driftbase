import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Tradition {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  created_by: string | null;
  created_at: string | null;
  creator?: {
    display_name: string;
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
        creator:created_by (display_name)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTraditions(data as unknown as Tradition[]);
    }
    setLoading(false);
  };

  const createTradition = async (title: string, description?: string, icon?: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('traditions')
      .insert({
        title,
        description: description || null,
        icon: icon || '🎉',
        created_by: user.id,
      })
      .select(`
        *,
        creator:created_by (display_name)
      `)
      .single();

    if (!error && data) {
      setTraditions(prev => [data as unknown as Tradition, ...prev]);
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