-- Add columns to profiles table for additional candidate information
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS about_me TEXT,
ADD COLUMN IF NOT EXISTS experience TEXT,
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS journey TEXT,
ADD COLUMN IF NOT EXISTS resume_url TEXT;