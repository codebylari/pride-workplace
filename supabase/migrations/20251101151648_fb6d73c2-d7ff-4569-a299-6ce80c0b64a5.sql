-- Allow companies to view profiles of candidates who applied to their jobs
CREATE POLICY "Companies can view candidate profiles who applied"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.candidate_id = profiles.id
    AND j.company_id = auth.uid()
  )
);

-- Create function to get candidate contact info (only for companies with applications)
CREATE OR REPLACE FUNCTION public.get_candidate_contact_info(_candidate_id uuid)
RETURNS TABLE(email text, linkedin_url text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify that the current user is a company with an application from this candidate
  IF NOT EXISTS (
    SELECT 1
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.candidate_id = _candidate_id
    AND j.company_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to candidate contact information';
  END IF;
  
  RETURN QUERY
  SELECT 
    u.email::text,
    p.linkedin_url
  FROM auth.users u
  JOIN profiles p ON p.id = u.id
  WHERE u.id = _candidate_id;
END;
$$;