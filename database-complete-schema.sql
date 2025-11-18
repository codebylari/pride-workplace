-- ============================================
-- SCRIPT SQL COMPLETO - PROJETO LINKA+
-- Documentação Completa do Banco de Dados
-- ============================================
-- 
-- Este arquivo documenta TODAS as 39 tabelas do projeto:
-- - 11 tabelas do schema PUBLIC (aplicação)
-- - 19 tabelas do schema AUTH (autenticação Supabase)
-- - 9 tabelas do schema STORAGE (armazenamento de arquivos)
--
-- Gerado em: 2025-11-18
-- ============================================

-- ============================================
-- SCHEMA: PUBLIC (11 TABELAS)
-- Descrição: Tabelas principais da aplicação Linka+
-- ============================================

-- ============================================
-- 1. TABELA: user_roles (papeis_usuarios)
-- Descrição: Armazena os papéis/funções dos usuários no sistema
-- ============================================
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'candidate', 'company')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, role)
);

-- ============================================
-- 2. TABELA: profiles (perfis_candidatos)
-- Descrição: Armazena informações dos candidatos
-- ============================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,
    full_name TEXT NOT NULL,
    social_name TEXT,
    city TEXT,
    state TEXT,
    experience_level TEXT,
    work_area TEXT,
    linkedin_url TEXT,
    about_me TEXT,
    experience TEXT,
    education TEXT,
    journey TEXT,
    resume_url TEXT,
    photo_url TEXT,
    rating NUMERIC(2,1) DEFAULT 5.0,
    total_ratings INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_pcd BOOLEAN DEFAULT false,
    pcd_type TEXT,
    is_lgbt BOOLEAN DEFAULT false,
    gender TEXT,
    specialization_areas TEXT[],
    opportunity_type TEXT[],
    github_level TEXT,
    remote_preference TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 3. TABELA: company_profiles (perfis_empresas)
-- Descrição: Armazena informações das empresas
-- ============================================
CREATE TABLE public.company_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    fantasy_name TEXT NOT NULL,
    cnpj TEXT NOT NULL UNIQUE,
    sector TEXT,
    city TEXT,
    state TEXT,
    description TEXT,
    about TEXT,
    seeking TEXT,
    training TEXT,
    essential_skills TEXT[],
    logo_url TEXT,
    rating NUMERIC(2,1) DEFAULT 5.0,
    total_ratings INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    testimonials JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 4. TABELA: jobs (vagas)
-- Descrição: Armazena as vagas de emprego publicadas pelas empresas
-- ============================================
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    salary TEXT,
    job_type TEXT NOT NULL,
    is_remote BOOLEAN DEFAULT false,
    requirements TEXT,
    required_experience_level TEXT,
    required_github_level TEXT,
    required_specialization_areas TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 5. TABELA: applications (candidaturas)
-- Descrição: Armazena as candidaturas dos candidatos às vagas
-- ============================================
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    job_id UUID NOT NULL,
    status TEXT DEFAULT 'pending',
    candidate_accepted BOOLEAN DEFAULT false,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    contract_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 6. TABELA: swipes (deslizes)
-- Descrição: Armazena as ações de like/dislike dos usuários
-- ============================================
CREATE TABLE public.swipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    target_id UUID NOT NULL,
    target_type TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 7. TABELA: matches (correspondencias)
-- Descrição: Armazena os matches entre candidatos e vagas
-- ============================================
CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    job_id UUID NOT NULL,
    company_id UUID NOT NULL,
    status TEXT DEFAULT 'active',
    matched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 8. TABELA: ratings (avaliacoes)
-- Descrição: Armazena as avaliações entre candidatos e empresas
-- ============================================
CREATE TABLE public.ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL,
    rater_id UUID NOT NULL,
    rated_user_id UUID NOT NULL,
    rating NUMERIC NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- 9. TABELA: notifications (notificacoes)
-- Descrição: Armazena as notificações do sistema
-- ============================================
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    related_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 10. TABELA: testimonials (depoimentos)
-- Descrição: Armazena depoimentos dos candidatos sobre empresas
-- ============================================
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL,
    company_id UUID NOT NULL,
    application_id UUID NOT NULL,
    job_title TEXT NOT NULL,
    comment TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 11. TABELA: admin_logs (logs_admin)
-- Descrição: Registra ações administrativas no sistema
-- ============================================
CREATE TABLE public.admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- SCHEMA: AUTH (19 TABELAS)
-- Descrição: Sistema de autenticação gerenciado pelo Supabase
-- IMPORTANTE: Estas tabelas são gerenciadas automaticamente pelo Supabase
-- e NÃO devem ser modificadas diretamente
-- ============================================

-- 1. auth.users - Usuários do sistema
-- 2. auth.sessions - Sessões ativas de usuários
-- 3. auth.refresh_tokens - Tokens de refresh para renovação de sessão
-- 4. auth.identities - Identidades de login (email, OAuth, etc)
-- 5. auth.audit_log_entries - Log de auditoria de ações de autenticação
-- 6. auth.mfa_factors - Fatores de autenticação multifator
-- 7. auth.mfa_challenges - Desafios de MFA
-- 8. auth.mfa_amr_claims - Claims de autenticação multifator
-- 9. auth.oauth_clients - Clientes OAuth configurados
-- 10. auth.oauth_authorizations - Autorizações OAuth
-- 11. auth.oauth_consents - Consentimentos OAuth
-- 12. auth.saml_providers - Provedores SAML SSO
-- 13. auth.saml_relay_states - Estados de relay SAML
-- 14. auth.sso_providers - Provedores de SSO
-- 15. auth.sso_domains - Domínios de SSO
-- 16. auth.one_time_tokens - Tokens de uso único (reset senha, etc)
-- 17. auth.flow_state - Estado de fluxo de autenticação
-- 18. auth.instances - Instâncias de autenticação
-- 19. auth.schema_migrations - Controle de versão do schema auth

-- ============================================
-- SCHEMA: STORAGE (9 TABELAS)
-- Descrição: Sistema de armazenamento de arquivos gerenciado pelo Supabase
-- IMPORTANTE: Estas tabelas são gerenciadas automaticamente pelo Supabase
-- e NÃO devem ser modificadas diretamente
-- ============================================

-- 1. storage.buckets - Buckets de armazenamento (profile-photos)
-- 2. storage.objects - Objetos/arquivos armazenados
-- 3. storage.buckets_analytics - Análises de uso dos buckets
-- 4. storage.buckets_vectors - Vetores para busca em buckets
-- 5. storage.migrations - Controle de versão do schema storage
-- 6. storage.prefixes - Prefixos de organização de arquivos
-- 7. storage.s3_multipart_uploads - Uploads multipart S3
-- 8. storage.s3_multipart_uploads_parts - Partes de uploads multipart
-- 9. storage.vector_indexes - Índices vetoriais para busca

-- ============================================
-- BUCKET DE ARMAZENAMENTO CONFIGURADO
-- ============================================

-- Bucket: profile-photos (público)
-- Usado para armazenar fotos de perfil de candidatos e logos de empresas

-- ============================================
-- RESUMO DA ESTRUTURA
-- ============================================
-- 
-- Total de Tabelas: 39
-- 
-- Schema PUBLIC: 11 tabelas
--   - Tabelas de usuários e perfis: 3 (user_roles, profiles, company_profiles)
--   - Tabelas de vagas e candidaturas: 2 (jobs, applications)
--   - Tabelas de interação: 2 (swipes, matches)
--   - Tabelas de feedback: 2 (ratings, testimonials)
--   - Tabelas de sistema: 2 (notifications, admin_logs)
--
-- Schema AUTH: 19 tabelas
--   - Sistema completo de autenticação gerenciado pelo Supabase
--   - Suporte para email, OAuth, SAML, MFA
--
-- Schema STORAGE: 9 tabelas
--   - Sistema completo de armazenamento de arquivos
--   - Suporte para uploads, análises, busca vetorial
--
-- ============================================
-- MAPEAMENTO: NOMES ACADÊMICOS → IMPLEMENTAÇÃO
-- ============================================
--
-- papeis_usuarios → user_roles
-- perfis_candidatos → profiles
-- perfis_empresas → company_profiles
-- vagas → jobs
-- candidaturas → applications
-- deslizes → swipes
-- correspondencias → matches
-- avaliacoes → ratings
-- notificacoes → notifications
-- depoimentos → testimonials
-- logs_admin → admin_logs
--
-- ============================================
