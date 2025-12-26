-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Create trigger for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'New Member'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create messages table for real-time chat
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages are viewable by authenticated users" ON public.messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own messages" ON public.messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" ON public.messages
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create sleepovers table
CREATE TABLE public.sleepovers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  location TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.sleepovers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sleepovers viewable by authenticated users" ON public.sleepovers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create sleepovers" ON public.sleepovers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their sleepovers" ON public.sleepovers
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete their sleepovers" ON public.sleepovers
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Create permission forms table
CREATE TABLE public.permission_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sleepover_id UUID NOT NULL REFERENCES public.sleepovers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  emergency_contact TEXT,
  emergency_phone TEXT,
  allergies TEXT,
  medications TEXT,
  medical_notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  digital_signature TEXT,
  signed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(sleepover_id, user_id)
);

ALTER TABLE public.permission_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Forms viewable by authenticated users" ON public.permission_forms
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create their own forms" ON public.permission_forms
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forms" ON public.permission_forms
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Create hall of fame/shame years
CREATE TABLE public.hall_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.hall_years ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hall years viewable by authenticated users" ON public.hall_years
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create years" ON public.hall_years
  FOR INSERT TO authenticated WITH CHECK (true);

-- Create hall folders (per sleepover)
CREATE TABLE public.hall_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year_id UUID NOT NULL REFERENCES public.hall_years(id) ON DELETE CASCADE,
  sleepover_id UUID REFERENCES public.sleepovers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  folder_type TEXT NOT NULL CHECK (folder_type IN ('fame', 'shame')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.hall_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hall folders viewable by authenticated users" ON public.hall_folders
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create folders" ON public.hall_folders
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update folders" ON public.hall_folders
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete folders" ON public.hall_folders
  FOR DELETE TO authenticated USING (true);

-- Create achievements/entries
CREATE TABLE public.hall_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID NOT NULL REFERENCES public.hall_folders(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏆',
  custom_badge_color TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.hall_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hall entries viewable by authenticated users" ON public.hall_entries
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create entries" ON public.hall_entries
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update entries" ON public.hall_entries
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete entries" ON public.hall_entries
  FOR DELETE TO authenticated USING (true);

-- Create voice rooms table
CREATE TABLE public.voice_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.voice_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Voice rooms viewable by authenticated users" ON public.voice_rooms
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create rooms" ON public.voice_rooms
  FOR INSERT TO authenticated WITH CHECK (true);

-- Create voice room participants
CREATE TABLE public.voice_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.voice_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_muted BOOLEAN DEFAULT false,
  UNIQUE(room_id, user_id)
);

ALTER TABLE public.voice_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants viewable by authenticated users" ON public.voice_participants
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can join rooms" ON public.voice_participants
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" ON public.voice_participants
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their participation" ON public.voice_participants
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Enable realtime for voice participants
ALTER PUBLICATION supabase_realtime ADD TABLE public.voice_participants;

-- Create sleepover logs table
CREATE TABLE public.sleepover_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sleepover_id UUID NOT NULL REFERENCES public.sleepovers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  highlights TEXT[],
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.sleepover_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logs viewable by authenticated users" ON public.sleepover_logs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create logs" ON public.sleepover_logs
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Creators can update logs" ON public.sleepover_logs
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Create traditions table
CREATE TABLE public.traditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🎉',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.traditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Traditions viewable by authenticated users" ON public.traditions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create traditions" ON public.traditions
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Creators can update traditions" ON public.traditions
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Create processes table
CREATE TABLE public.processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]',
  icon TEXT DEFAULT '📋',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Processes viewable by authenticated users" ON public.processes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create processes" ON public.processes
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Creators can update processes" ON public.processes
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();