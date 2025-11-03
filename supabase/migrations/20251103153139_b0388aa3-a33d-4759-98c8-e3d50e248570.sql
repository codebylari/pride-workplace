-- Criar tabela para armazenar swipes/likes
CREATE TABLE IF NOT EXISTS public.swipes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  target_id uuid NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('job', 'candidate')),
  action text NOT NULL CHECK (action IN ('like', 'dislike', 'super_like')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela para armazenar matches confirmados
CREATE TABLE IF NOT EXISTS public.matches (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id uuid NOT NULL,
  job_id uuid NOT NULL,
  company_id uuid NOT NULL,
  matched_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  UNIQUE(candidate_id, job_id)
);

-- Enable RLS
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- RLS policies para swipes
CREATE POLICY "Users can view their own swipes"
ON public.swipes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own swipes"
ON public.swipes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all swipes"
ON public.swipes FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies para matches
CREATE POLICY "Candidates can view their matches"
ON public.matches FOR SELECT
USING (auth.uid() = candidate_id);

CREATE POLICY "Companies can view their matches"
ON public.matches FOR SELECT
USING (auth.uid() = company_id);

CREATE POLICY "System can create matches"
ON public.matches FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all matches"
ON public.matches FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Criar índices para performance
CREATE INDEX idx_swipes_user_id ON public.swipes(user_id);
CREATE INDEX idx_swipes_target_id ON public.swipes(target_id);
CREATE INDEX idx_matches_candidate_id ON public.matches(candidate_id);
CREATE INDEX idx_matches_company_id ON public.matches(company_id);
CREATE INDEX idx_matches_job_id ON public.matches(job_id);

-- Função para criar match automaticamente quando há like mútuo
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS TRIGGER AS $$
BEGIN
  -- Se é um like de candidato em uma vaga
  IF NEW.action = 'like' AND NEW.target_type = 'job' THEN
    -- Verificar se a empresa também deu like no candidato
    IF EXISTS (
      SELECT 1 FROM public.swipes s
      JOIN public.jobs j ON s.user_id = j.company_id
      WHERE s.target_id = NEW.user_id
      AND s.target_type = 'candidate'
      AND s.action IN ('like', 'super_like')
      AND j.id = NEW.target_id
    ) THEN
      -- Criar match
      INSERT INTO public.matches (candidate_id, job_id, company_id)
      SELECT NEW.user_id, NEW.target_id, j.company_id
      FROM public.jobs j
      WHERE j.id = NEW.target_id
      ON CONFLICT (candidate_id, job_id) DO NOTHING;
    END IF;
  
  -- Se é um like de empresa em um candidato
  ELSIF NEW.action = 'like' AND NEW.target_type = 'candidate' THEN
    -- Verificar se o candidato também deu like em alguma vaga desta empresa
    IF EXISTS (
      SELECT 1 FROM public.swipes s
      JOIN public.jobs j ON s.target_id = j.id
      WHERE s.user_id = NEW.target_id
      AND s.target_type = 'job'
      AND s.action IN ('like', 'super_like')
      AND j.company_id = NEW.user_id
    ) THEN
      -- Criar match com a vaga que o candidato deu like
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Criar trigger para verificar matches
CREATE TRIGGER on_swipe_check_match
  AFTER INSERT ON public.swipes
  FOR EACH ROW
  EXECUTE FUNCTION public.check_and_create_match();