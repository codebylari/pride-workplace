-- Criar função para notificar quando contrato terminar
CREATE OR REPLACE FUNCTION public.notify_contract_completed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  company_user_id UUID;
  company_name TEXT;
  candidate_name TEXT;
BEGIN
  IF NEW.contract_status = 'completed' AND OLD.contract_status != 'completed' THEN
    -- Buscar informações
    SELECT company_id INTO company_user_id
    FROM jobs
    WHERE id = NEW.job_id;
    
    SELECT fantasy_name INTO company_name
    FROM company_profiles
    WHERE user_id = company_user_id;
    
    SELECT full_name INTO candidate_name
    FROM profiles
    WHERE id = NEW.candidate_id;
    
    -- Notificar candidato para avaliar empresa
    INSERT INTO notifications (user_id, title, message, type, related_id)
    VALUES (
      NEW.candidate_id,
      'Contrato Concluído',
      'Seu contrato com ' || company_name || ' foi concluído. Avalie sua experiência!',
      'rate_company',
      NEW.id
    );
    
    -- Notificar empresa para avaliar candidato
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
$function$;

CREATE TRIGGER on_contract_completed
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_contract_completed();