-- =============================================
-- LINKAR DATABASE SCHEMA
-- Generated for documentation purposes
-- =============================================

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE public.app_role AS ENUM ('admin', 'candidate', 'company');
CREATE TYPE public.contract_status AS ENUM ('pending', 'active', 'completed', 'cancelled');

-- =============================================
-- TABLES
-- =============================================

-- User Roles Table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Candidate Profiles Table
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY,
    full_name text NOT NULL,
    social_name text,
    photo_url text,
    linkedin_url text,
    resume_url text,
    about_me text,
    gender text,
    city text,
    state text,
    experience text,
    education text,
    journey text,
    is_pcd boolean DEFAULT false,
    pcd_type text,
    is_lgbt boolean DEFAULT false,
    work_area text,
    experience_level text,
    github_level text,
    remote_preference text,
    specialization_areas text[],
    opportunity_type text[],
    rating numeric DEFAULT 5.0,
    total_ratings integer DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Company Profiles Table
CREATE TABLE public.company_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    fantasy_name text NOT NULL,
    cnpj text NOT NULL,
    logo_url text,
    description text,
    sector text,
    city text,
    state text,
    about text,
    seeking text,
    training text,
    testimonials jsonb DEFAULT '[]'::jsonb,
    rating numeric DEFAULT 5.0,
    total_ratings integer DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Jobs Table
CREATE TABLE public.jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    location text NOT NULL,
    salary text,
    requirements text,
    job_type text NOT NULL,
    is_remote boolean DEFAULT false,
    required_experience_level text,
    required_github_level text,
    required_specialization_areas text[],
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Applications Table
CREATE TABLE public.applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id uuid NOT NULL,
    job_id uuid NOT NULL,
    status text NOT NULL DEFAULT 'pending'::text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    candidate_accepted boolean DEFAULT false,
    contract_status contract_status DEFAULT 'pending'::contract_status,
    completed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Swipes Table
CREATE TABLE public.swipes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    target_id uuid NOT NULL,
    target_type text NOT NULL,
    action text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Matches Table
CREATE TABLE public.matches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id uuid NOT NULL,
    job_id uuid NOT NULL,
    company_id uuid NOT NULL,
    status text NOT NULL DEFAULT 'active'::text,
    matched_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Ratings Table
CREATE TABLE public.ratings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    rater_id uuid NOT NULL,
    rated_user_id uuid NOT NULL,
    application_id uuid NOT NULL,
    rating numeric NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT now()
);

-- Notifications Table
CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL,
    related_id uuid,
    read boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Testimonials Table
CREATE TABLE public.testimonials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id uuid NOT NULL,
    company_id uuid NOT NULL,
    application_id uuid NOT NULL,
    job_title text NOT NULL,
    comment text NOT NULL,
    status text NOT NULL DEFAULT 'pending'::text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Admin Logs Table
CREATE TABLE public.admin_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id uuid NOT NULL,
    action text NOT NULL,
    details jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get candidate contact information
CREATE OR REPLACE FUNCTION public.get_candidate_contact_info(_candidate_id uuid)
RETURNS TABLE(email text, linkedin_url text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
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

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

-- Function to handle admin user creation
CREATE OR REPLACE FUNCTION public.handle_admin_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.email = 'admLinka@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Function to check and create matches
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.action = 'like' AND NEW.target_type = 'job' THEN
    IF EXISTS (
      SELECT 1 FROM public.swipes s
      JOIN public.jobs j ON s.user_id = j.company_id
      WHERE s.target_id = NEW.user_id
      AND s.target_type = 'candidate'
      AND s.action IN ('like', 'super_like')
      AND j.id = NEW.target_id
    ) THEN
      INSERT INTO public.matches (candidate_id, job_id, company_id)
      SELECT NEW.user_id, NEW.target_id, j.company_id
      FROM public.jobs j
      WHERE j.id = NEW.target_id
      ON CONFLICT (candidate_id, job_id) DO NOTHING;
    END IF;
  
  ELSIF NEW.action = 'like' AND NEW.target_type = 'candidate' THEN
    IF EXISTS (
      SELECT 1 FROM public.swipes s
      JOIN public.jobs j ON s.target_id = j.id
      WHERE s.user_id = NEW.target_id
      AND s.target_type = 'job'
      AND s.action IN ('like', 'super_like')
      AND j.company_id = NEW.user_id
    ) THEN
      INSERT INTO public.matches (candidate_id, job_id, company_id)
      SELECT NEW.target_id, j.id, NEW.user_id
      FROM public.jobs j
      JOIN public.swipes s ON s.target_id = j.id
      WHERE s.user_id = NEW.target_id
      AND s.target_type = 'job'
      AND s.action IN ('like', 'super_like')
      AND j.company_id = NEW.user_id
      LIMIT 1
      ON CONFLICT (candidate_id, job_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function to update candidate rating
CREATE OR REPLACE FUNCTION public.update_candidate_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  avg_rating DECIMAL(2,1);
  rating_count INTEGER;
BEGIN
  SELECT 
    ROUND(AVG(rating)::numeric, 1),
    COUNT(*)
  INTO avg_rating, rating_count
  FROM public.ratings
  WHERE rated_user_id = NEW.rated_user_id
  AND rated_user_id IN (SELECT id FROM public.profiles);
  
  UPDATE public.profiles
  SET 
    rating = COALESCE(avg_rating, 5.0),
    total_ratings = rating_count
  WHERE id = NEW.rated_user_id;
  
  RETURN NEW;
END;
$$;

-- Function to update company rating
CREATE OR REPLACE FUNCTION public.update_company_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  avg_rating DECIMAL(2,1);
  rating_count INTEGER;
BEGIN
  SELECT 
    ROUND(AVG(rating)::numeric, 1),
    COUNT(*)
  INTO avg_rating, rating_count
  FROM public.ratings
  WHERE rated_user_id = NEW.rated_user_id
  AND rated_user_id IN (SELECT user_id FROM public.company_profiles);
  
  UPDATE public.company_profiles
  SET 
    rating = COALESCE(avg_rating, 5.0),
    total_ratings = rating_count
  WHERE user_id = NEW.rated_user_id;
  
  RETURN NEW;
END;
$$;

-- Function to reactivate account
CREATE OR REPLACE FUNCTION public.reactivate_account()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.profiles
  SET is_active = true
  WHERE id = NEW.id AND is_active = false;
  
  UPDATE public.company_profiles
  SET is_active = true
  WHERE user_id = NEW.id AND is_active = false;
  
  RETURN NEW;
END;
$$;

-- Function to notify company of new application
CREATE OR REPLACE FUNCTION public.notify_company_new_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  company_user_id UUID;
  job_title TEXT;
  candidate_name TEXT;
BEGIN
  SELECT company_id, title INTO company_user_id, job_title
  FROM jobs
  WHERE id = NEW.job_id;
  
  SELECT full_name INTO candidate_name
  FROM profiles
  WHERE id = NEW.candidate_id;
  
  INSERT INTO notifications (user_id, title, message, type, related_id)
  VALUES (
    company_user_id,
    'Nova Candidatura',
    candidate_name || ' se candidatou para a vaga ' || job_title,
    'new_application',
    NEW.id
  );
  
  RETURN NEW;
END;
$$;

-- Function to notify candidate of application status change
CREATE OR REPLACE FUNCTION public.notify_candidate_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  job_title TEXT;
  company_name TEXT;
BEGIN
  IF NEW.status != OLD.status AND (NEW.status = 'accepted' OR NEW.status = 'contact_requested') THEN
    SELECT j.title, cp.fantasy_name INTO job_title, company_name
    FROM jobs j
    JOIN company_profiles cp ON j.company_id = cp.user_id
    WHERE j.id = NEW.job_id;
    
    IF NEW.status = 'accepted' THEN
      INSERT INTO notifications (user_id, title, message, type, related_id)
      VALUES (
        NEW.candidate_id,
        'Candidatura Aceita!',
        'Sua candidatura para ' || job_title || ' na empresa ' || company_name || ' foi aceita!',
        'application_accepted',
        NEW.id
      );
    ELSIF NEW.status = 'contact_requested' THEN
      INSERT INTO notifications (user_id, title, message, type, related_id)
      VALUES (
        NEW.candidate_id,
        'Solicitação de Contato',
        company_name || ' deseja entrar em contato sobre a vaga ' || job_title,
        'contact_requested',
        NEW.id
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function to notify candidate when contract is accepted
CREATE OR REPLACE FUNCTION public.notify_candidate_contract_accepted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  company_user_id UUID;
  company_name TEXT;
BEGIN
  IF NEW.candidate_accepted = true AND (OLD.candidate_accepted IS NULL OR OLD.candidate_accepted = false) THEN
    SELECT company_id INTO company_user_id
    FROM jobs
    WHERE id = NEW.job_id;
    
    SELECT fantasy_name INTO company_name
    FROM company_profiles
    WHERE user_id = company_user_id;
    
    INSERT INTO notifications (user_id, title, message, type, related_id)
    VALUES (
      company_user_id,
      'Contrato Aceito!',
      'O candidato aceitou o contrato. O trabalho começará em ' || to_char(NEW.start_date, 'DD/MM/YYYY'),
      'contract_accepted',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function to notify when contract is completed
CREATE OR REPLACE FUNCTION public.notify_contract_completed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  company_user_id UUID;
  company_name TEXT;
  candidate_name TEXT;
BEGIN
  IF NEW.contract_status = 'completed' AND OLD.contract_status != 'completed' THEN
    SELECT company_id INTO company_user_id
    FROM jobs
    WHERE id = NEW.job_id;
    
    SELECT fantasy_name INTO company_name
    FROM company_profiles
    WHERE user_id = company_user_id;
    
    SELECT full_name INTO candidate_name
    FROM profiles
    WHERE id = NEW.candidate_id;
    
    INSERT INTO notifications (user_id, title, message, type, related_id)
    VALUES (
      NEW.candidate_id,
      'Contrato Concluído',
      'Seu contrato com ' || company_name || ' foi concluído. Avalie sua experiência!',
      'rate_company',
      NEW.id
    );
    
    INSERT INTO notifications (user_id, title, message, type, related_id)
    VALUES (
      company_user_id,
      'Contrato Concluído',
      'O contrato com ' || candidate_name || ' foi concluído. Avalie a experiência!',
      'rate_candidate',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function to notify company of new testimonial
CREATE OR REPLACE FUNCTION public.notify_company_new_testimonial()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  candidate_name TEXT;
  company_name TEXT;
BEGIN
  SELECT full_name INTO candidate_name
  FROM profiles
  WHERE id = NEW.candidate_id;
  
  SELECT fantasy_name INTO company_name
  FROM company_profiles
  WHERE user_id = NEW.company_id;
  
  INSERT INTO notifications (user_id, title, message, type, related_id)
  VALUES (
    NEW.company_id,
    'Novo Depoimento Recebido',
    candidate_name || ' deixou um depoimento sobre a experiência de trabalho. Revise e aprove para exibir no seu perfil.',
    'new_testimonial',
    NEW.id
  );
  
  RETURN NEW;
END;
$$;

-- Function to notify candidate when testimonial is approved
CREATE OR REPLACE FUNCTION public.notify_candidate_testimonial_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  company_name TEXT;
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    SELECT fantasy_name INTO company_name
    FROM company_profiles
    WHERE user_id = NEW.company_id;
    
    INSERT INTO notifications (user_id, title, message, type, related_id)
    VALUES (
      NEW.candidate_id,
      'Depoimento Aprovado',
      company_name || ' aprovou seu depoimento! Ele agora está visível no perfil da empresa.',
      'testimonial_approved',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- USER_ROLES Policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

-- PROFILES Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Companies can view candidate profiles who applied" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.candidate_id = profiles.id
    AND j.company_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all candidate profiles" ON public.profiles
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- COMPANY_PROFILES Policies
CREATE POLICY "Companies can view their own profile" ON public.company_profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Companies can update their own profile" ON public.company_profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Companies can insert their own profile" ON public.company_profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view active company profiles" ON public.company_profiles
FOR SELECT USING (is_active = true);

CREATE POLICY "Candidates can view companies with jobs" ON public.company_profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM jobs
    WHERE jobs.company_id = company_profiles.user_id
  )
);

CREATE POLICY "Admins can view all company profiles" ON public.company_profiles
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- JOBS Policies
CREATE POLICY "Companies can view their own jobs" ON public.jobs
FOR SELECT USING (auth.uid() = company_id);

CREATE POLICY "Companies can create their own jobs" ON public.jobs
FOR INSERT WITH CHECK (auth.uid() = company_id);

CREATE POLICY "Companies can update their own jobs" ON public.jobs
FOR UPDATE USING (auth.uid() = company_id);

CREATE POLICY "Companies can delete their own jobs" ON public.jobs
FOR DELETE USING (auth.uid() = company_id);

CREATE POLICY "Everyone can view published jobs" ON public.jobs
FOR SELECT USING (true);

CREATE POLICY "Admins can view all jobs" ON public.jobs
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- APPLICATIONS Policies
CREATE POLICY "Candidates can view their own applications" ON public.applications
FOR SELECT USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can create applications" ON public.applications
FOR INSERT WITH CHECK (auth.uid() = candidate_id);

CREATE POLICY "Companies can view applications for their jobs" ON public.applications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM jobs
    WHERE jobs.id = applications.job_id
    AND jobs.company_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all applications" ON public.applications
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- SWIPES Policies
CREATE POLICY "Users can view their own swipes" ON public.swipes
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own swipes" ON public.swipes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all swipes" ON public.swipes
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- MATCHES Policies
CREATE POLICY "Candidates can view their matches" ON public.matches
FOR SELECT USING (auth.uid() = candidate_id);

CREATE POLICY "Companies can view their matches" ON public.matches
FOR SELECT USING (auth.uid() = company_id);

CREATE POLICY "System can create matches" ON public.matches
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all matches" ON public.matches
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RATINGS Policies
CREATE POLICY "Users can view ratings they gave or received" ON public.ratings
FOR SELECT USING (auth.uid() = rater_id OR auth.uid() = rated_user_id);

CREATE POLICY "Users can create ratings for completed contracts" ON public.ratings
FOR INSERT WITH CHECK (
  auth.uid() = rater_id AND
  EXISTS (
    SELECT 1 FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.id = ratings.application_id
    AND a.contract_status = 'completed'::contract_status
    AND (
      (a.candidate_id = auth.uid() AND j.company_id = ratings.rated_user_id) OR
      (j.company_id = auth.uid() AND a.candidate_id = ratings.rated_user_id)
    )
  )
);

CREATE POLICY "Admins can view all ratings" ON public.ratings
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- NOTIFICATIONS Policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all notifications" ON public.notifications
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- TESTIMONIALS Policies
CREATE POLICY "Candidatos podem criar depoimentos para contratos concluídos" ON public.testimonials
FOR INSERT WITH CHECK (
  auth.uid() = candidate_id AND
  EXISTS (
    SELECT 1 FROM applications
    WHERE applications.id = testimonials.application_id
    AND applications.candidate_id = auth.uid()
    AND applications.contract_status = 'completed'::contract_status
  )
);

CREATE POLICY "Candidatos podem ver seus próprios depoimentos" ON public.testimonials
FOR SELECT USING (auth.uid() = candidate_id);

CREATE POLICY "Empresas podem ver depoimentos sobre elas" ON public.testimonials
FOR SELECT USING (auth.uid() = company_id);

CREATE POLICY "Empresas podem atualizar status dos depoimentos" ON public.testimonials
FOR UPDATE USING (auth.uid() = company_id) WITH CHECK (auth.uid() = company_id);

CREATE POLICY "Todos podem ver depoimentos aprovados" ON public.testimonials
FOR SELECT USING (status = 'approved'::text);

-- ADMIN_LOGS Policies
CREATE POLICY "Admins can view logs" ON public.admin_logs
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create logs" ON public.admin_logs
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- STORAGE BUCKETS
-- =============================================

-- Profile Photos Bucket (public)
-- Bucket Name: profile-photos
-- Public Access: Yes

-- =============================================
-- END OF SCHEMA
-- =============================================
