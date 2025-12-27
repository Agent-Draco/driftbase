import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.email) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('admin_emails')
        .select('email')
        .eq('email', user.email)
        .maybeSingle();

      setIsAdmin(!!data && !error);
      setLoading(false);
    };

    checkAdmin();
  }, [user?.email]);

  return { isAdmin, loading };
}
