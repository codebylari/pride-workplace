-- ============================================
-- PROJETO LINKA+ - BANCO DE DADOS
-- REQUISITO: CRIAÇÃO DE TABELAS
-- ============================================
-- Aluno: [SEU NOME]
-- Disciplina: Banco de Dados
-- ============================================

-- ============================================
-- 1. CRIAÇÃO DA DATABASE
-- ============================================
CREATE DATABASE linkar_db;

-- ============================================
-- 2. CRIAÇÃO DAS TABELAS (MÍNIMO: 2 TABELAS)
-- ============================================

-- ----------------------------------------------
-- TABELA 1: papeis_usuarios
-- Descrição: Armazena os papéis/funções dos usuários
-- Chave Primária: id_papel (NUMÉRICA - SERIAL)
-- Atributos: 4 campos
-- ----------------------------------------------
CREATE TABLE papeis_usuarios (
    id_papel SERIAL PRIMARY KEY,              -- PK numérica auto-incrementável
    user_id INTEGER NOT NULL,                  -- ID do usuário
    papel VARCHAR(20) NOT NULL CHECK (papel IN ('admin', 'candidate', 'company')),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, papel)
);

-- ----------------------------------------------
-- TABELA 2: perfis_candidatos
-- Descrição: Armazena informações dos candidatos
-- Chave Primária: id_candidato (NUMÉRICA - SERIAL)
-- Chave Estrangeira: user_id → papeis_usuarios
-- Atributos: 14 campos
-- ----------------------------------------------
CREATE TABLE perfis_candidatos (
    id_candidato SERIAL PRIMARY KEY,          -- PK numérica auto-incrementável
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
    
    -- CHAVE ESTRANGEIRA (RELACIONAMENTO)
    FOREIGN KEY (user_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE
);

-- ----------------------------------------------
-- TABELA 3: perfis_empresas
-- Descrição: Armazena informações das empresas
-- Chave Primária: id_empresa (NUMÉRICA - SERIAL)
-- Chave Estrangeira: user_id → papeis_usuarios
-- Atributos: 13 campos
-- ----------------------------------------------
CREATE TABLE perfis_empresas (
    id_empresa SERIAL PRIMARY KEY,            -- PK numérica auto-incrementável
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
    
    -- CHAVE ESTRANGEIRA (RELACIONAMENTO)
    FOREIGN KEY (user_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE
);

-- ----------------------------------------------
-- TABELA 4: vagas
-- Descrição: Armazena vagas de emprego
-- Chave Primária: id_vaga (NUMÉRICA - SERIAL)
-- Chave Estrangeira: empresa_id → papeis_usuarios
-- Atributos: 10 campos
-- ----------------------------------------------
CREATE TABLE vagas (
    id_vaga SERIAL PRIMARY KEY,               -- PK numérica auto-incrementável
    empresa_id INTEGER NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    localizacao VARCHAR(200),
    salario VARCHAR(100),
    tipo_trabalho VARCHAR(50),
    remoto BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- CHAVE ESTRANGEIRA (RELACIONAMENTO)
    FOREIGN KEY (empresa_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE
);

-- ----------------------------------------------
-- TABELA 5: candidaturas
-- Descrição: Armazena candidaturas às vagas
-- Chave Primária: id_candidatura (NUMÉRICA - SERIAL)
-- Chaves Estrangeiras: candidato_id, vaga_id
-- Atributos: 9 campos
-- ----------------------------------------------
CREATE TABLE candidaturas (
    id_candidatura SERIAL PRIMARY KEY,        -- PK numérica auto-incrementável
    candidato_id INTEGER NOT NULL,
    vaga_id INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    aceito_candidato BOOLEAN DEFAULT FALSE,
    data_inicio DATE,
    data_fim DATE,
    status_contrato VARCHAR(50) DEFAULT 'pending',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP,
    
    -- CHAVES ESTRANGEIRAS (RELACIONAMENTOS)
    FOREIGN KEY (candidato_id) REFERENCES perfis_candidatos(id_candidato) ON DELETE CASCADE,
    FOREIGN KEY (vaga_id) REFERENCES vagas(id_vaga) ON DELETE CASCADE
);

-- ============================================
-- VERIFICAÇÃO DOS REQUISITOS
-- ============================================

-- ✅ REQUISITO 1: Pelo menos 2 tabelas criadas
--    → Criadas 5 tabelas: papeis_usuarios, perfis_candidatos, 
--      perfis_empresas, vagas, candidaturas

-- ✅ REQUISITO 2: Pelo menos 1 chave estrangeira
--    → Criadas 4 chaves estrangeiras:
--      - perfis_candidatos.user_id → papeis_usuarios.user_id
--      - perfis_empresas.user_id → papeis_usuarios.user_id
--      - vagas.empresa_id → papeis_usuarios.user_id
--      - candidaturas.candidato_id → perfis_candidatos.id_candidato
--      - candidaturas.vaga_id → vagas.id_vaga

-- ✅ REGRA 1: Todas as tabelas têm PK numérica
--    → Todas as PKs são do tipo SERIAL (auto-incrementável)

-- ✅ REGRA 2: Todas as tabelas têm pelo menos 2 atributos
--    → Mínimo: 4 atributos (papeis_usuarios)
--    → Máximo: 14 atributos (perfis_candidatos)

-- ============================================
-- FIM DO ARQUIVO
-- ============================================