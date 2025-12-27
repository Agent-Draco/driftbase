-- Create admin_emails table for managing administrators
CREATE TABLE public.admin_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- Admins list is viewable by authenticated users (so they can check if they're admin)
CREATE POLICY "Admin emails viewable by authenticated users" 
ON public.admin_emails 
FOR SELECT 
USING (true);

-- No INSERT/UPDATE/DELETE policies - this table should only be managed via database directly