-- ============================================
-- SCRIPT SQL - PROJETO LINKA+
-- Trabalho Acadêmico - Banco de Dados
-- ============================================

-- ============================================
-- 1. CRIAÇÃO DA DATABASE
-- ============================================

CREATE DATABASE linkar_db;

-- ============================================
-- 2. CRIAÇÃO DAS TABELAS
-- ============================================

-- Tabela: papeis_usuarios (user_roles)
-- Descrição: Armazena os papéis/funções dos usuários no sistema
CREATE TABLE papeis_usuarios (
    id_papel SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    papel VARCHAR(20) NOT NULL CHECK (papel IN ('admin', 'candidate', 'company')),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, papel)
);

-- Tabela: perfis_candidatos (profiles)
-- Descrição: Armazena informações dos candidatos
CREATE TABLE perfis_candidatos (
    id_candidato SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    nome_social VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    nivel_experiencia VARCHAR(50),
    area_trabalho VARCHAR(100),
    linkedin_url TEXT,
    sobre_mim TEXT,
    avaliacao DECIMAL(2,1) DEFAULT 5.0,
    total_avaliacoes INTEGER DEFAULT 0,
    esta_ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE
);

-- Tabela: perfis_empresas (company_profiles)
-- Descrição: Armazena informações das empresas
CREATE TABLE perfis_empresas (
    id_empresa SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    nome_fantasia VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    setor VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    descricao TEXT,
    sobre TEXT,
    avaliacao DECIMAL(2,1) DEFAULT 5.0,
    total_avaliacoes INTEGER DEFAULT 0,
    esta_ativo BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE
);

-- Tabela: vagas (jobs)
-- Descrição: Armazena as vagas de emprego publicadas pelas empresas
CREATE TABLE vagas (
    id_vaga SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    localizacao VARCHAR(200),
    salario VARCHAR(100),
    tipo_trabalho VARCHAR(50),
    remoto BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE
);

-- Tabela: candidaturas (applications)
-- Descrição: Armazena as candidaturas dos candidatos às vagas
CREATE TABLE candidaturas (
    id_candidatura SERIAL PRIMARY KEY,
    candidato_id INTEGER NOT NULL,
    vaga_id INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    aceito_candidato BOOLEAN DEFAULT FALSE,
    data_inicio DATE,
    data_fim DATE,
    status_contrato VARCHAR(50) DEFAULT 'pending',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP,
    FOREIGN KEY (candidato_id) REFERENCES perfis_candidatos(id_candidato) ON DELETE CASCADE,
    FOREIGN KEY (vaga_id) REFERENCES vagas(id_vaga) ON DELETE CASCADE
);

-- Tabela: deslizes (swipes)
-- Descrição: Armazena as ações de like/dislike dos usuários
CREATE TABLE deslizes (
    id_deslize SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    alvo_id INTEGER NOT NULL,
    tipo_alvo VARCHAR(20) NOT NULL,
    acao VARCHAR(20) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE
);

-- Tabela: correspondencias (matches)
-- Descrição: Armazena os matches entre candidatos e vagas
CREATE TABLE correspondencias (
    id_correspondencia SERIAL PRIMARY KEY,
    candidato_id INTEGER NOT NULL,
    vaga_id INTEGER NOT NULL,
    empresa_id INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    data_match TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidato_id) REFERENCES perfis_candidatos(id_candidato) ON DELETE CASCADE,
    FOREIGN KEY (vaga_id) REFERENCES vagas(id_vaga) ON DELETE CASCADE,
    FOREIGN KEY (empresa_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE
);

-- Tabela: avaliacoes (ratings)
-- Descrição: Armazena as avaliações entre candidatos e empresas
CREATE TABLE avaliacoes (
    id_avaliacao SERIAL PRIMARY KEY,
    avaliador_id INTEGER NOT NULL,
    avaliado_id INTEGER NOT NULL,
    candidatura_id INTEGER NOT NULL,
    nota DECIMAL(2,1) NOT NULL,
    comentario TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (avaliador_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE,
    FOREIGN KEY (avaliado_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE,
    FOREIGN KEY (candidatura_id) REFERENCES candidaturas(id_candidatura) ON DELETE CASCADE
);

-- Tabela: notificacoes (notifications)
-- Descrição: Armazena as notificações do sistema
CREATE TABLE notificacoes (
    id_notificacao SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    relacionado_id INTEGER,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE
);

-- Tabela: depoimentos (testimonials)
-- Descrição: Armazena depoimentos dos candidatos sobre empresas
CREATE TABLE depoimentos (
    id_depoimento SERIAL PRIMARY KEY,
    candidato_id INTEGER NOT NULL,
    empresa_id INTEGER NOT NULL,
    candidatura_id INTEGER NOT NULL,
    titulo_vaga VARCHAR(255) NOT NULL,
    comentario TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidato_id) REFERENCES perfis_candidatos(id_candidato) ON DELETE CASCADE,
    FOREIGN KEY (empresa_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE,
    FOREIGN KEY (candidatura_id) REFERENCES candidaturas(id_candidatura) ON DELETE CASCADE
);

-- Tabela: logs_admin (admin_logs)
-- Descrição: Registra ações administrativas no sistema
CREATE TABLE logs_admin (
    id_log SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    acao VARCHAR(100) NOT NULL,
    detalhes JSONB,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE
);
