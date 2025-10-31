-- Add rating column to profiles (candidates start with 5.0)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0;

-- Add rating column to company_profiles (companies start with 5.0)
ALTER TABLE public.company_profiles ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5);
ALTER TABLE public.company_profiles ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0;

-- Add contract_status to applications
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contract_status') THEN
    CREATE TYPE public.contract_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
  END IF;
END $$;

ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS contract_status contract_status DEFAULT 'pending';
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Create ratings table
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rated_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(application_id, rater_id)
);

-- Enable RLS on ratings
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ratings
CREATE POLICY "Users can view ratings they gave or received"
ON public.ratings
FOR SELECT
USING (auth.uid() = rater_id OR auth.uid() = rated_user_id);

CREATE POLICY "Users can create ratings for completed contracts"
ON public.ratings
FOR INSERT
WITH CHECK (
  auth.uid() = rater_id AND
  EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.jobs j ON a.job_id = j.id
    WHERE a.id = application_id
    AND a.contract_status = 'completed'
    AND (
      (a.candidate_id = auth.uid() AND j.company_id = rated_user_id) OR
      (j.company_id = auth.uid() AND a.candidate_id = rated_user_id)
    )
  )
);

-- Function to update candidate rating average
CREATE OR REPLACE FUNCTION public.update_candidate_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_rating DECIMAL(2,1);
  rating_count INTEGER;
BEGIN
  -- Calculate average rating for the candidate
  SELECT 
    ROUND(AVG(rating)::numeric, 1),
    COUNT(*)
  INTO avg_rating, rating_count
  FROM public.ratings
  WHERE rated_user_id = NEW.rated_user_id
  AND rated_user_id IN (SELECT id FROM public.profiles);
  
  -- Update candidate profile
  UPDATE public.profiles
  SET 
    rating = COALESCE(avg_rating, 5.0),
    total_ratings = rating_count
  WHERE id = NEW.rated_user_id;
  
  RETURN NEW;
END;
$$;

-- Function to update company rating average
CREATE OR REPLACE FUNCTION public.update_company_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_rating DECIMAL(2,1);
  rating_count INTEGER;
BEGIN
  -- Calculate average rating for the company
  SELECT 
    ROUND(AVG(rating)::numeric, 1),
    COUNT(*)
  INTO avg_rating, rating_count
  FROM public.ratings
  WHERE rated_user_id = NEW.rated_user_id
  AND rated_user_id IN (SELECT user_id FROM public.company_profiles);
  
  -- Update company profile
  UPDATE public.company_profiles
  SET 
    rating = COALESCE(avg_rating, 5.0),
    total_ratings = rating_count
  WHERE user_id = NEW.rated_user_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update ratings after insert
CREATE TRIGGER update_ratings_after_insert
AFTER INSERT ON public.ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_candidate_rating();

CREATE TRIGGER update_company_ratings_after_insert
AFTER INSERT ON public.ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_company_rating();

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_ratings_rated_user ON public.ratings(rated_user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_application ON public.ratings(application_id);
CREATE INDEX IF NOT EXISTS idx_applications_contract_status ON public.applications(contract_status);