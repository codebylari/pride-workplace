-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  related_id UUID,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Function to create notification when application is created
CREATE OR REPLACE FUNCTION notify_company_new_application()
RETURNS TRIGGER AS $$
DECLARE
  company_user_id UUID;
  job_title TEXT;
  candidate_name TEXT;
BEGIN
  -- Get company user_id and job title
  SELECT company_id, title INTO company_user_id, job_title
  FROM jobs
  WHERE id = NEW.job_id;
  
  -- Get candidate name
  SELECT full_name INTO candidate_name
  FROM profiles
  WHERE id = NEW.candidate_id;
  
  -- Create notification for company
  INSERT INTO public.notifications (user_id, title, message, type, related_id)
  VALUES (
    company_user_id,
    'Nova Candidatura',
    candidate_name || ' se candidatou para a vaga ' || job_title,
    'new_application',
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new applications
CREATE TRIGGER on_application_created
AFTER INSERT ON public.applications
FOR EACH ROW
EXECUTE FUNCTION notify_company_new_application();

-- Function to create notification when application status changes
CREATE OR REPLACE FUNCTION notify_candidate_status_change()
RETURNS TRIGGER AS $$
DECLARE
  job_title TEXT;
  company_name TEXT;
BEGIN
  -- Only notify if status changed to accepted or contact_requested
  IF NEW.status != OLD.status AND (NEW.status = 'accepted' OR NEW.status = 'contact_requested') THEN
    -- Get job title
    SELECT j.title, cp.fantasy_name INTO job_title, company_name
    FROM jobs j
    JOIN company_profiles cp ON j.company_id = cp.user_id
    WHERE j.id = NEW.job_id;
    
    IF NEW.status = 'accepted' THEN
      INSERT INTO public.notifications (user_id, title, message, type, related_id)
      VALUES (
        NEW.candidate_id,
        'Candidatura Aceita!',
        'Sua candidatura para ' || job_title || ' na empresa ' || company_name || ' foi aceita!',
        'application_accepted',
        NEW.id
      );
    ELSIF NEW.status = 'contact_requested' THEN
      INSERT INTO public.notifications (user_id, title, message, type, related_id)
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for application status changes
CREATE TRIGGER on_application_status_changed
AFTER UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION notify_candidate_status_change();