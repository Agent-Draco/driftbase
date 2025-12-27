-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'away', 'offline')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Create messages table for real-time chat
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "Messages viewable by authenticated users" ON public.messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages" ON public.messages
  FOR DELETE TO authenticated USING (auth.uid() = sender_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create sleepovers table (events that can have hall entries)
CREATE TABLE public.sleepovers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  event_date DATE NOT NULL,
  year INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM event_date)) STORED,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on sleepovers
ALTER TABLE public.sleepovers ENABLE ROW LEVEL SECURITY;

-- Sleepovers policies
CREATE POLICY "Sleepovers viewable by authenticated users" ON public.sleepovers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create sleepovers" ON public.sleepovers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update sleepovers" ON public.sleepovers
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete sleepovers" ON public.sleepovers
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Create RSVPs table
CREATE TABLE public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sleepover_id UUID REFERENCES public.sleepovers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('confirmed', 'declined', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(sleepover_id, user_id)
);

-- Enable RLS on rsvps
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- RSVPs policies
CREATE POLICY "RSVPs viewable by authenticated users" ON public.rsvps
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create their own RSVPs" ON public.rsvps
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own RSVPs" ON public.rsvps
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Create achievements table (customizable achievements)
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏆',
  type TEXT NOT NULL CHECK (type IN ('fame', 'shame')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Achievements policies
CREATE POLICY "Achievements viewable by authenticated users" ON public.achievements
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create achievements" ON public.achievements
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update achievements" ON public.achievements
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete achievements" ON public.achievements
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Create hall entries table (fame/shame awards per sleepover)
CREATE TABLE public.hall_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sleepover_id UUID REFERENCES public.sleepovers(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  winner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('fame', 'shame')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on hall_entries
ALTER TABLE public.hall_entries ENABLE ROW LEVEL SECURITY;

-- Hall entries policies
CREATE POLICY "Hall entries viewable by authenticated users" ON public.hall_entries
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create hall entries" ON public.hall_entries
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update hall entries" ON public.hall_entries
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete hall entries" ON public.hall_entries
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Create traditions table
CREATE TABLE public.traditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on traditions
ALTER TABLE public.traditions ENABLE ROW LEVEL SECURITY;

-- Traditions policies
CREATE POLICY "Traditions viewable by authenticated users" ON public.traditions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create traditions" ON public.traditions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update traditions" ON public.traditions
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Create processes table
CREATE TABLE public.processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  steps TEXT[] NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on processes
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;

-- Processes policies
CREATE POLICY "Processes viewable by authenticated users" ON public.processes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create processes" ON public.processes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update processes" ON public.processes
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Create sleepover logs table
CREATE TABLE public.sleepover_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sleepover_id UUID REFERENCES public.sleepovers(id) ON DELETE CASCADE NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on sleepover_logs
ALTER TABLE public.sleepover_logs ENABLE ROW LEVEL SECURITY;

-- Logs policies
CREATE POLICY "Logs viewable by authenticated users" ON public.sleepover_logs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create logs" ON public.sleepover_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update logs" ON public.sleepover_logs
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'username',
    COALESCE(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'username'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN new;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profile timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();