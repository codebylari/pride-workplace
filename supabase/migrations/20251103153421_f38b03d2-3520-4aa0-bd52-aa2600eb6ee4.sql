-- Adicionar foreign keys para as tabelas matches
ALTER TABLE public.matches
ADD CONSTRAINT fk_matches_candidate
FOREIGN KEY (candidate_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.matches
ADD CONSTRAINT fk_matches_job
FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;

ALTER TABLE public.matches
ADD CONSTRAINT fk_matches_company
FOREIGN KEY (company_id) REFERENCES auth.users(id) ON DELETE CASCADE;