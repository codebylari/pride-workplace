-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  job_type TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT,
  requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Companies can view their own jobs
CREATE POLICY "Companies can view their own jobs"
ON public.jobs
FOR SELECT
USING (auth.uid() = company_id);

-- Companies can create their own jobs
CREATE POLICY "Companies can create their own jobs"
ON public.jobs
FOR INSERT
WITH CHECK (auth.uid() = company_id);

-- Companies can update their own jobs
CREATE POLICY "Companies can update their own jobs"
ON public.jobs
FOR UPDATE
USING (auth.uid() = company_id);

-- Companies can delete their own jobs
CREATE POLICY "Companies can delete their own jobs"
ON public.jobs
FOR DELETE
USING (auth.uid() = company_id);

-- Everyone can view published jobs
CREATE POLICY "Everyone can view published jobs"
ON public.jobs
FOR SELECT
USING (true);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Candidates can view their own applications
CREATE POLICY "Candidates can view their own applications"
ON public.applications
FOR SELECT
USING (auth.uid() = candidate_id);

-- Candidates can create applications
CREATE POLICY "Candidates can create applications"
ON public.applications
FOR INSERT
WITH CHECK (auth.uid() = candidate_id);

-- Companies can view applications for their jobs
CREATE POLICY "Companies can view applications for their jobs"
ON public.applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = applications.job_id
    AND jobs.company_id = auth.uid()
  )
);

-- Add trigger for jobs updated_at
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();