-- Create voice rooms table
CREATE TABLE public.voice_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create voice room participants table
CREATE TABLE public.voice_room_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.voice_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_muted BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Create private messages table
CREATE TABLE public.private_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_emails table for controlling edit permissions
CREATE TABLE public.admin_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the admin email
INSERT INTO public.admin_emails (email) VALUES ('thinklytics@outlook.com');

-- Enable RLS on all tables
ALTER TABLE public.voice_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- Voice rooms policies
CREATE POLICY "Voice rooms viewable by authenticated users"
ON public.voice_rooms FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create voice rooms"
ON public.voice_rooms FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update voice rooms"
ON public.voice_rooms FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Creators can delete voice rooms"
ON public.voice_rooms FOR DELETE USING (auth.uid() = created_by);

-- Voice room participants policies
CREATE POLICY "Participants viewable by authenticated users"
ON public.voice_room_participants FOR SELECT USING (true);

CREATE POLICY "Users can join voice rooms"
ON public.voice_room_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their participation"
ON public.voice_room_participants FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can leave voice rooms"
ON public.voice_room_participants FOR DELETE USING (auth.uid() = user_id);

-- Private messages policies
CREATE POLICY "Users can view their own messages"
ON public.private_messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send private messages"
ON public.private_messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their sent messages"
ON public.private_messages FOR UPDATE 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Admin emails readable by authenticated users
CREATE POLICY "Admin emails readable by authenticated users"
ON public.admin_emails FOR SELECT USING (true);

-- Enable realtime for private messages and voice rooms
ALTER PUBLICATION supabase_realtime ADD TABLE public.private_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.voice_room_participants;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_emails WHERE email = user_email
  )
$$;