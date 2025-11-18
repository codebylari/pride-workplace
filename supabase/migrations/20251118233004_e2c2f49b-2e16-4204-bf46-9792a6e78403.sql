-- ============================================
-- ADICIONAR FOREIGN KEYS AO BANCO DE DADOS
-- ============================================

-- 1. user_roles -> auth.users
ALTER TABLE public.user_roles
ADD CONSTRAINT fk_user_roles_user_id 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 2. profiles -> auth.users
ALTER TABLE public.profiles
ADD CONSTRAINT fk_profiles_id 
FOREIGN KEY (id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 3. company_profiles -> auth.users
ALTER TABLE public.company_profiles
ADD CONSTRAINT fk_company_profiles_user_id 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 4. jobs -> company_profiles
ALTER TABLE public.jobs
ADD CONSTRAINT fk_jobs_company_id 
FOREIGN KEY (company_id) 
REFERENCES public.company_profiles(user_id) 
ON DELETE CASCADE;

-- 5. applications -> profiles
ALTER TABLE public.applications
ADD CONSTRAINT fk_applications_candidate_id 
FOREIGN KEY (candidate_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- 6. applications -> jobs
ALTER TABLE public.applications
ADD CONSTRAINT fk_applications_job_id 
FOREIGN KEY (job_id) 
REFERENCES public.jobs(id) 
ON DELETE CASCADE;

-- 7. swipes -> auth.users
ALTER TABLE public.swipes
ADD CONSTRAINT fk_swipes_user_id 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 8. matches -> profiles
ALTER TABLE public.matches
ADD CONSTRAINT fk_matches_candidate_id 
FOREIGN KEY (candidate_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- 9. matches -> jobs
ALTER TABLE public.matches
ADD CONSTRAINT fk_matches_job_id 
FOREIGN KEY (job_id) 
REFERENCES public.jobs(id) 
ON DELETE CASCADE;

-- 10. matches -> company_profiles
ALTER TABLE public.matches
ADD CONSTRAINT fk_matches_company_id 
FOREIGN KEY (company_id) 
REFERENCES public.company_profiles(user_id) 
ON DELETE CASCADE;

-- 11. ratings -> applications
ALTER TABLE public.ratings
ADD CONSTRAINT fk_ratings_application_id 
FOREIGN KEY (application_id) 
REFERENCES public.applications(id) 
ON DELETE CASCADE;

-- 12. ratings -> auth.users (rater)
ALTER TABLE public.ratings
ADD CONSTRAINT fk_ratings_rater_id 
FOREIGN KEY (rater_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 13. ratings -> auth.users (rated)
ALTER TABLE public.ratings
ADD CONSTRAINT fk_ratings_rated_user_id 
FOREIGN KEY (rated_user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 14. notifications -> auth.users
ALTER TABLE public.notifications
ADD CONSTRAINT fk_notifications_user_id 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 15. testimonials -> profiles
ALTER TABLE public.testimonials
ADD CONSTRAINT fk_testimonials_candidate_id 
FOREIGN KEY (candidate_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- 16. testimonials -> company_profiles
ALTER TABLE public.testimonials
ADD CONSTRAINT fk_testimonials_company_id 
FOREIGN KEY (company_id) 
REFERENCES public.company_profiles(user_id) 
ON DELETE CASCADE;

-- 17. testimonials -> applications
ALTER TABLE public.testimonials
ADD CONSTRAINT fk_testimonials_application_id 
FOREIGN KEY (application_id) 
REFERENCES public.applications(id) 
ON DELETE CASCADE;

-- 18. admin_logs -> auth.users
ALTER TABLE public.admin_logs
ADD CONSTRAINT fk_admin_logs_admin_id 
FOREIGN KEY (admin_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;