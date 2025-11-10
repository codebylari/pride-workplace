-- Add social_name column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS social_name text;

-- Update handle_new_user function to include social_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO profiles (
    id, 
    full_name,
    social_name,
    is_pcd, 
    pcd_type, 
    is_lgbt
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    NEW.raw_user_meta_data->>'social_name',
    COALESCE((NEW.raw_user_meta_data->>'is_pcd')::boolean, false),
    NEW.raw_user_meta_data->>'pcd_type',
    COALESCE((NEW.raw_user_meta_data->>'is_lgbt')::boolean, false)
  );
  
  INSERT INTO user_roles (user_id, role)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'role')::app_role
  );
  
  RETURN NEW;
END;
$function$;