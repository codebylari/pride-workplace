-- Drop triggers first
DROP TRIGGER IF EXISTS on_application_created ON public.applications;
DROP TRIGGER IF EXISTS on_application_status_changed ON public.applications;

-- Drop functions
DROP FUNCTION IF EXISTS notify_company_new_application();
DROP FUNCTION IF EXISTS notify_candidate_status_change();

-- Recreate functions with proper search_path
CREATE OR REPLACE FUNCTION notify_company_new_application()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION notify_candidate_status_change()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
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

-- Recreate triggers
CREATE TRIGGER on_application_created
AFTER INSERT ON public.applications
FOR EACH ROW
EXECUTE FUNCTION notify_company_new_application();

CREATE TRIGGER on_application_status_changed
AFTER UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION notify_candidate_status_change();