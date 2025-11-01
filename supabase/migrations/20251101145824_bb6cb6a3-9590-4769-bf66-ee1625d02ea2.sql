-- Criar trigger para notificar candidato quando aceitar contrato
CREATE OR REPLACE FUNCTION public.notify_candidate_contract_accepted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

CREATE TRIGGER on_contract_accepted
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_candidate_contract_accepted();