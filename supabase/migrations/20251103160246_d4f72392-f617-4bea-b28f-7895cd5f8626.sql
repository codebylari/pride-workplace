-- Criar tabela de depoimentos/relatos
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL,
  company_id UUID NOT NULL,
  job_title TEXT NOT NULL,
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(application_id)
);

-- Habilitar RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Candidatos podem criar depoimentos para contratos concluídos"
ON public.testimonials
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = candidate_id AND
  EXISTS (
    SELECT 1 FROM public.applications
    WHERE id = application_id
    AND candidate_id = auth.uid()
    AND contract_status = 'completed'
  )
);

CREATE POLICY "Candidatos podem ver seus próprios depoimentos"
ON public.testimonials
FOR SELECT
TO authenticated
USING (auth.uid() = candidate_id);

CREATE POLICY "Empresas podem ver depoimentos sobre elas"
ON public.testimonials
FOR SELECT
TO authenticated
USING (auth.uid() = company_id);

CREATE POLICY "Empresas podem atualizar status dos depoimentos"
ON public.testimonials
FOR UPDATE
TO authenticated
USING (auth.uid() = company_id)
WITH CHECK (auth.uid() = company_id);

CREATE POLICY "Todos podem ver depoimentos aprovados"
ON public.testimonials
FOR SELECT
TO authenticated
USING (status = 'approved');

-- Trigger para atualizar updated_at
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Função para notificar empresa sobre novo depoimento
CREATE OR REPLACE FUNCTION public.notify_company_new_testimonial()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  candidate_name TEXT;
  company_name TEXT;
BEGIN
  -- Buscar nome do candidato
  SELECT full_name INTO candidate_name
  FROM profiles
  WHERE id = NEW.candidate_id;
  
  -- Buscar nome da empresa
  SELECT fantasy_name INTO company_name
  FROM company_profiles
  WHERE user_id = NEW.company_id;
  
  -- Notificar empresa
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

-- Trigger para notificar sobre novo depoimento
CREATE TRIGGER on_testimonial_created
AFTER INSERT ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.notify_company_new_testimonial();

-- Função para notificar candidato quando depoimento é aprovado
CREATE OR REPLACE FUNCTION public.notify_candidate_testimonial_approved()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  company_name TEXT;
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Buscar nome da empresa
    SELECT fantasy_name INTO company_name
    FROM company_profiles
    WHERE user_id = NEW.company_id;
    
    -- Notificar candidato
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

-- Trigger para notificar sobre depoimento aprovado
CREATE TRIGGER on_testimonial_approved
AFTER UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.notify_candidate_testimonial_approved();