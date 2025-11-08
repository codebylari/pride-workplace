-- Permitir que candidatos e qualquer usuário autenticado vejam perfis de empresas
CREATE POLICY "Anyone can view active company profiles"
ON public.company_profiles
FOR SELECT
USING (is_active = true);

-- Permitir que candidatos vejam perfis de empresas que postaram vagas
CREATE POLICY "Candidates can view companies with jobs"
ON public.company_profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.company_id = company_profiles.user_id
  )
);