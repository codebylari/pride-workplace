-- Add state and city columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

-- Add state and city columns to company_profiles table
ALTER TABLE public.company_profiles 
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;