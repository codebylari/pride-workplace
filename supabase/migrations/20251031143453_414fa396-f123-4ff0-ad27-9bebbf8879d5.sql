-- Add logo_url column to company_profiles table
ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;