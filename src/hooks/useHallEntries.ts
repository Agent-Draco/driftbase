import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface HallEntry {
  id: string;
  folder_id: string;
  member_id: string;
  title: string;
  description: string | null;
  icon: string | null;
  custom_badge_color: string | null;
  created_by: string | null;
  created_at: string | null;
  member?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
  folder?: {
    id: string;
    title: string;
    folder_type: string;
    year_id: string;
    sleepover_id: string | null;
  };
}

export interface HallFolder {
  id: string;
  title: string;
  folder_type: string;
  year_id: string;
  sleepover_id: string | null;
  created_at: string | null;
  year?: {
    id: string;
    year: number;
  };
  sleepover?: {
    id: string;
    title: string;
    event_date: string;
  } | null;
  entries?: HallEntry[];
}

export interface HallYear {
  id: string;
  year: number;
  created_at: string | null;
  folders?: HallFolder[];
}

export function useHallEntries(folderType: 'fame' | 'shame') {
  const [years, setYears] = useState<HallYear[]>([]);
  const [folders, setFolders] = useState<HallFolder[]>([]);
  const [entries, setEntries] = useState<HallEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch years
      const { data: yearsData } = await supabase
        .from('hall_years')
        .select('*')
        .order('year', { ascending: false });

      if (yearsData) {
        setYears(yearsData);
      }

      // Fetch folders of this type
      const { data: foldersData } = await supabase
        .from('hall_folders')
        .select(`
          *,
          year:year_id (id, year),
          sleepover:sleepover_id (id, title, event_date)
        `)
        .eq('folder_type', folderType)
        .order('created_at', { ascending: false });

      if (foldersData) {
        setFolders(foldersData as unknown as HallFolder[]);
      }

      // Fetch entries
      const { data: entriesData } = await supabase
        .from('hall_entries')
        .select(`
          *,
          member:member_id (id, display_name, avatar_url),
          folder:folder_id (id, title, folder_type, year_id, sleepover_id)
        `)
        .order('created_at', { ascending: false });

      if (entriesData) {
        // Filter entries that belong to folders of this type
        const filteredEntries = entriesData.filter((e: any) => 
          e.folder?.folder_type === folderType
        );
        setEntries(filteredEntries as unknown as HallEntry[]);
      }

      setLoading(false);
    };

    fetchData();
  }, [user, folderType]);

  const createYear = async (year: number) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('hall_years')
      .insert({ year })
      .select()
      .single();

    if (!error && data) {
      setYears(prev => [data, ...prev].sort((a, b) => b.year - a.year));
    }

    return { data, error };
  };

  const createFolder = async (title: string, yearId: string, sleepoverId?: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('hall_folders')
      .insert({
        title,
        folder_type: folderType,
        year_id: yearId,
        sleepover_id: sleepoverId || null,
      })
      .select(`
        *,
        year:year_id (id, year),
        sleepover:sleepover_id (id, title, event_date)
      `)
      .single();

    if (!error && data) {
      setFolders(prev => [data as unknown as HallFolder, ...prev]);
    }

    return { data, error };
  };

  const createEntry = async (entry: {
    folder_id: string;
    member_id: string;
    title: string;
    description?: string;
    icon?: string;
    custom_badge_color?: string;
  }) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('hall_entries')
      .insert({
        ...entry,
        created_by: user.id,
      })
      .select(`
        *,
        member:member_id (id, display_name, avatar_url),
        folder:folder_id (id, title, folder_type, year_id, sleepover_id)
      `)
      .single();

    if (!error && data) {
      setEntries(prev => [data as unknown as HallEntry, ...prev]);
    }

    return { data, error };
  };

  const deleteEntry = async (entryId: string) => {
    const { error } = await supabase
      .from('hall_entries')
      .delete()
      .eq('id', entryId);

    if (!error) {
      setEntries(prev => prev.filter(e => e.id !== entryId));
    }

    return { error };
  };

  const deleteFolder = async (folderId: string) => {
    const { error } = await supabase
      .from('hall_folders')
      .delete()
      .eq('id', folderId);

    if (!error) {
      setFolders(prev => prev.filter(f => f.id !== folderId));
      setEntries(prev => prev.filter(e => e.folder_id !== folderId));
    }

    return { error };
  };

  // Group folders by year
  const foldersByYear = years.reduce((acc, year) => {
    acc[year.id] = {
      year,
      folders: folders.filter(f => f.year_id === year.id),
    };
    return acc;
  }, {} as Record<string, { year: HallYear; folders: HallFolder[] }>);

  // Group entries by folder
  const entriesByFolder = entries.reduce((acc, entry) => {
    if (!acc[entry.folder_id]) {
      acc[entry.folder_id] = [];
    }
    acc[entry.folder_id].push(entry);
    return acc;
  }, {} as Record<string, HallEntry[]>);

  return {
    years,
    folders,
    entries,
    foldersByYear,
    entriesByFolder,
    loading,
    createYear,
    createFolder,
    createEntry,
    deleteEntry,
    deleteFolder,
  };
}