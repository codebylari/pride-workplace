-- Adicionar campos de data de início e fim do contrato
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS candidate_accepted BOOLEAN DEFAULT false;