-- Adicionar campos de qualificação aos perfis de candidatos
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS specialization_areas TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS work_area TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience_level TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS opportunity_type TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github_level TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS remote_preference TEXT;

-- Adicionar campos de requisitos às vagas
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS required_experience_level TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS required_github_level TEXT;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS required_specialization_areas TEXT[];
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS is_remote BOOLEAN DEFAULT false;

-- Comentários para documentação
COMMENT ON COLUMN public.profiles.specialization_areas IS 'Áreas de especialização do candidato (ex: Ciências de Dados, Testes, etc)';
COMMENT ON COLUMN public.profiles.work_area IS 'Área principal de atuação do candidato';
COMMENT ON COLUMN public.profiles.experience_level IS 'Nível de experiência: Júnior, Pleno, Sênior, Especialista';
COMMENT ON COLUMN public.profiles.opportunity_type IS 'Tipos de oportunidade buscados: Estágio, CLT, Freelancer, etc';
COMMENT ON COLUMN public.profiles.github_level IS 'Nível de conhecimento em GitHub: Básico, Intermediário, Avançado, Nenhum conhecimento';
COMMENT ON COLUMN public.profiles.remote_preference IS 'Preferência por trabalho remoto: sim, talvez, nao';

COMMENT ON COLUMN public.jobs.required_experience_level IS 'Nível de experiência exigido para a vaga';
COMMENT ON COLUMN public.jobs.required_github_level IS 'Nível mínimo de GitHub exigido';
COMMENT ON COLUMN public.jobs.required_specialization_areas IS 'Áreas de especialização requeridas';
COMMENT ON COLUMN public.jobs.is_remote IS 'Indica se a vaga é remota';