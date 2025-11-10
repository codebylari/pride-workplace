-- Add inclusion fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_pcd boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS pcd_type text,
ADD COLUMN IF NOT EXISTS is_lgbt boolean DEFAULT false;