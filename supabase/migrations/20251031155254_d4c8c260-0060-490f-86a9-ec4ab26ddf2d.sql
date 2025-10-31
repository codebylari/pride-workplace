-- Add columns to company_profiles table for additional company information
ALTER TABLE company_profiles 
ADD COLUMN IF NOT EXISTS about TEXT,
ADD COLUMN IF NOT EXISTS seeking TEXT,
ADD COLUMN IF NOT EXISTS training TEXT,
ADD COLUMN IF NOT EXISTS testimonials JSONB DEFAULT '[]'::jsonb;