-- Add is_active column to profiles table
ALTER TABLE public.profiles
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Add is_active column to company_profiles table
ALTER TABLE public.company_profiles
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Create function to reactivate account on login
CREATE OR REPLACE FUNCTION public.reactivate_account()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Reactivate profile if exists
  UPDATE public.profiles
  SET is_active = true
  WHERE id = NEW.id AND is_active = false;
  
  -- Reactivate company profile if exists
  UPDATE public.company_profiles
  SET is_active = true
  WHERE user_id = NEW.id AND is_active = false;
  
  RETURN NEW;
END;
$$;

-- Create trigger to reactivate account when user signs in
DROP TRIGGER IF EXISTS on_auth_user_signin ON auth.users;
CREATE TRIGGER on_auth_user_signin
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.reactivate_account();