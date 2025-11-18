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

-- ============================================
-- 1. TABELA: auth.users
-- Descrição: Usuários do sistema
-- ============================================
CREATE TABLE auth.users (
    instance_id UUID,
    id UUID PRIMARY KEY,
    aud VARCHAR(255),
    role VARCHAR(255),
    email VARCHAR(255),
    encrypted_password VARCHAR(255),
    email_confirmed_at TIMESTAMP WITH TIME ZONE,
    invited_at TIMESTAMP WITH TIME ZONE,
    confirmation_token VARCHAR(255),
    confirmation_sent_at TIMESTAMP WITH TIME ZONE,
    recovery_token VARCHAR(255),
    recovery_sent_at TIMESTAMP WITH TIME ZONE,
    email_change_token_new VARCHAR(255),
    email_change VARCHAR(255),
    email_change_sent_at TIMESTAMP WITH TIME ZONE,
    last_sign_in_at TIMESTAMP WITH TIME ZONE,
    raw_app_meta_data JSONB,
    raw_user_meta_data JSONB,
    is_super_admin BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    phone TEXT,
    phone_confirmed_at TIMESTAMP WITH TIME ZONE,
    phone_change TEXT,
    phone_change_token VARCHAR(255),
    phone_change_sent_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    email_change_token_current VARCHAR(255),
    email_change_confirm_status SMALLINT,
    banned_until TIMESTAMP WITH TIME ZONE,
    reauthentication_token VARCHAR(255),
    reauthentication_sent_at TIMESTAMP WITH TIME ZONE,
    is_sso_user BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_anonymous BOOLEAN DEFAULT false
);

-- ============================================
-- 2. TABELA: auth.sessions
-- Descrição: Sessões ativas de usuários
-- ============================================
CREATE TABLE auth.sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    factor_id UUID,
    aal TEXT,
    not_after TIMESTAMP WITH TIME ZONE,
    refreshed_at TIMESTAMP,
    user_agent TEXT,
    ip INET,
    tag TEXT
);

-- ============================================
-- 3. TABELA: auth.refresh_tokens
-- Descrição: Tokens de refresh para renovação de sessão
-- ============================================
CREATE TABLE auth.refresh_tokens (
    instance_id UUID,
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255),
    user_id VARCHAR(255),
    revoked BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    parent VARCHAR(255),
    session_id UUID
);

-- ============================================
-- 4. TABELA: auth.identities
-- Descrição: Identidades de login (email, OAuth, etc)
-- ============================================
CREATE TABLE auth.identities (
    provider_id TEXT NOT NULL,
    user_id UUID NOT NULL,
    identity_data JSONB NOT NULL,
    provider TEXT NOT NULL,
    last_sign_in_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    email TEXT,
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- ============================================
-- 5. TABELA: auth.audit_log_entries
-- Descrição: Log de auditoria de ações de autenticação
-- ============================================
CREATE TABLE auth.audit_log_entries (
    instance_id UUID,
    id UUID PRIMARY KEY,
    payload JSON,
    created_at TIMESTAMP WITH TIME ZONE,
    ip_address VARCHAR(64) DEFAULT ''
);

-- ============================================
-- 6. TABELA: auth.mfa_factors
-- Descrição: Fatores de autenticação multifator
-- ============================================
CREATE TABLE auth.mfa_factors (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    friendly_name TEXT,
    factor_type TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    secret TEXT,
    phone TEXT,
    last_challenged_at TIMESTAMP WITH TIME ZONE,
    web_authn_credential JSONB,
    web_authn_aaguid UUID
);

-- ============================================
-- 7. TABELA: auth.mfa_challenges
-- Descrição: Desafios de MFA
-- ============================================
CREATE TABLE auth.mfa_challenges (
    id UUID PRIMARY KEY,
    factor_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    ip_address INET NOT NULL,
    otp_code TEXT,
    web_authn_session_data JSONB
);

-- ============================================
-- 8. TABELA: auth.mfa_amr_claims
-- Descrição: Claims de autenticação multifator
-- ============================================
CREATE TABLE auth.mfa_amr_claims (
    session_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    authentication_method TEXT NOT NULL,
    id UUID PRIMARY KEY
);

-- ============================================
-- 9. TABELA: auth.oauth_clients
-- Descrição: Clientes OAuth configurados
-- ============================================
CREATE TABLE auth.oauth_clients (
    id UUID PRIMARY KEY,
    client_id TEXT NOT NULL,
    client_secret TEXT,
    redirect_uris TEXT[] NOT NULL,
    scope TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================
-- 10. TABELA: auth.oauth_authorizations
-- Descrição: Autorizações OAuth
-- ============================================
CREATE TABLE auth.oauth_authorizations (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    client_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================
-- 11. TABELA: auth.oauth_consents
-- Descrição: Consentimentos OAuth
-- ============================================
CREATE TABLE auth.oauth_consents (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    client_id TEXT NOT NULL,
    scope TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ============================================
-- 12. TABELA: auth.saml_providers
-- Descrição: Provedores SAML SSO
-- ============================================
CREATE TABLE auth.saml_providers (
    id UUID PRIMARY KEY,
    sso_provider_id UUID NOT NULL,
    entity_id TEXT NOT NULL,
    metadata_xml TEXT NOT NULL,
    metadata_url TEXT,
    attribute_mapping JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    name_id_format TEXT
);

-- ============================================
-- 13. TABELA: auth.saml_relay_states
-- Descrição: Estados de relay SAML
-- ============================================
CREATE TABLE auth.saml_relay_states (
    id UUID PRIMARY KEY,
    sso_provider_id UUID NOT NULL,
    request_id TEXT NOT NULL,
    for_email TEXT,
    redirect_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    flow_state_id UUID
);

-- ============================================
-- 14. TABELA: auth.sso_providers
-- Descrição: Provedores de SSO
-- ============================================
CREATE TABLE auth.sso_providers (
    id UUID PRIMARY KEY,
    resource_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 15. TABELA: auth.sso_domains
-- Descrição: Domínios de SSO
-- ============================================
CREATE TABLE auth.sso_domains (
    id UUID PRIMARY KEY,
    sso_provider_id UUID NOT NULL,
    domain TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 16. TABELA: auth.one_time_tokens
-- Descrição: Tokens de uso único (reset senha, etc)
-- ============================================
CREATE TABLE auth.one_time_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    token_type TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    relates_to TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- ============================================
-- 17. TABELA: auth.flow_state
-- Descrição: Estado de fluxo de autenticação
-- ============================================
CREATE TABLE auth.flow_state (
    id UUID PRIMARY KEY,
    user_id UUID,
    auth_code TEXT NOT NULL,
    code_challenge_method TEXT NOT NULL,
    code_challenge TEXT NOT NULL,
    provider_type TEXT NOT NULL,
    provider_access_token TEXT,
    provider_refresh_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    authentication_method TEXT NOT NULL,
    auth_code_issued_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 18. TABELA: auth.instances
-- Descrição: Instâncias de autenticação
-- ============================================
CREATE TABLE auth.instances (
    id UUID PRIMARY KEY,
    uuid UUID,
    raw_base_config TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 19. TABELA: auth.schema_migrations
-- Descrição: Controle de versão do schema auth
-- ============================================
CREATE TABLE auth.schema_migrations (
    version VARCHAR(255) PRIMARY KEY
);

-- ============================================
-- SCHEMA: STORAGE (9 TABELAS)
-- Descrição: Sistema de armazenamento de arquivos gerenciado pelo Supabase
-- IMPORTANTE: Estas tabelas são gerenciadas automaticamente pelo Supabase
-- e NÃO devem ser modificadas diretamente
-- ============================================

-- ============================================
-- 1. TABELA: storage.buckets
-- Descrição: Buckets de armazenamento (profile-photos)
-- ============================================
CREATE TABLE storage.buckets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    public BOOLEAN DEFAULT false,
    avif_autodetection BOOLEAN DEFAULT false,
    file_size_limit BIGINT,
    allowed_mime_types TEXT[],
    owner_id TEXT,
    type TEXT NOT NULL DEFAULT 'STANDARD'
);

-- ============================================
-- 2. TABELA: storage.objects
-- Descrição: Objetos/arquivos armazenados
-- ============================================
CREATE TABLE storage.objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bucket_id TEXT,
    name TEXT,
    owner UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    metadata JSONB,
    path_tokens TEXT[],
    version TEXT,
    owner_id TEXT,
    user_metadata JSONB,
    level INTEGER
);

-- ============================================
-- 3. TABELA: storage.buckets_analytics
-- Descrição: Análises de uso dos buckets
-- ============================================
CREATE TABLE storage.buckets_analytics (
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'ANALYTICS',
    format TEXT NOT NULL DEFAULT 'ICEBERG',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 4. TABELA: storage.buckets_vectors
-- Descrição: Vetores para busca em buckets
-- ============================================
CREATE TABLE storage.buckets_vectors (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL DEFAULT 'VECTOR',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 5. TABELA: storage.migrations
-- Descrição: Controle de versão do schema storage
-- ============================================
CREATE TABLE storage.migrations (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    hash VARCHAR(40) NOT NULL,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. TABELA: storage.prefixes
-- Descrição: Prefixos de organização de arquivos
-- ============================================
CREATE TABLE storage.prefixes (
    bucket_id TEXT NOT NULL,
    name TEXT NOT NULL,
    level INTEGER NOT NULL,
    metadata JSONB
);

-- ============================================
-- 7. TABELA: storage.s3_multipart_uploads
-- Descrição: Uploads multipart S3
-- ============================================
CREATE TABLE storage.s3_multipart_uploads (
    id TEXT PRIMARY KEY,
    in_progress_size BIGINT DEFAULT 0,
    upload_signature TEXT NOT NULL,
    bucket_id TEXT NOT NULL,
    key TEXT NOT NULL,
    version TEXT NOT NULL,
    owner_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_metadata JSONB
);

-- ============================================
-- 8. TABELA: storage.s3_multipart_uploads_parts
-- Descrição: Partes de uploads multipart
-- ============================================
CREATE TABLE storage.s3_multipart_uploads_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    upload_id TEXT NOT NULL,
    size BIGINT NOT NULL DEFAULT 0,
    part_number INTEGER NOT NULL,
    bucket_id TEXT NOT NULL,
    key TEXT NOT NULL,
    etag TEXT NOT NULL,
    owner_id TEXT,
    version TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 9. TABELA: storage.vector_indexes
-- Descrição: Índices vetoriais para busca
-- ============================================
CREATE TABLE storage.vector_indexes (
    id BIGSERIAL PRIMARY KEY,
    bucket_id TEXT NOT NULL,
    dimensions INTEGER NOT NULL,
    metric TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

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
