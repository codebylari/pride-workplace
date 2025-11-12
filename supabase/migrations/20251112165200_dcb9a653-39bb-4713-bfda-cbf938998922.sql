-- Adicionar coluna de competências essenciais para empresas
ALTER TABLE public.company_profiles
ADD COLUMN IF NOT EXISTS essential_skills text[];

-- Comentário explicativo
COMMENT ON COLUMN public.company_profiles.essential_skills IS 'Competências essenciais que a empresa busca em candidatos (Ciência de Dados, Testes, Cibersegurança, etc.)';