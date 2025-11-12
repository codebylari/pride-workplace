-- ============================================
-- SCRIPT SQL - PROJETO LINKA+
-- Trabalho Acadêmico - Banco de Dados
-- Database: linkar_db
-- ============================================

-- ============================================
-- 1. CRIAÇÃO DAS TABELAS
-- ============================================

-- Tabela: papeis_usuarios (user_roles)
-- Descrição: Armazena os papéis/funções dos usuários no sistema
-- Relacionamentos: Referenciada por perfis_candidatos, perfis_empresas e logs_admin
CREATE TABLE papeis_usuarios (
    id_papel SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    papel VARCHAR(20) NOT NULL CHECK (papel IN ('admin', 'candidate', 'company')),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, papel)
);

-- Tabela: perfis_candidatos (profiles)
-- Descrição: Armazena informações dos candidatos
-- Relacionamentos: Possui chave estrangeira para papeis_usuarios
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
-- Relacionamentos: Possui chave estrangeira para papeis_usuarios
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

-- Tabela: logs_admin (admin_logs)
-- Descrição: Registra ações administrativas no sistema
-- Relacionamentos: Possui chave estrangeira para papeis_usuarios
CREATE TABLE logs_admin (
    id_log SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    acao VARCHAR(100) NOT NULL,
    detalhes JSONB,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES papeis_usuarios(user_id) ON DELETE CASCADE
);

-- ============================================
-- 2. CRIAÇÃO DE FUNÇÃO
-- ============================================

-- Função: atualizar_data_modificacao
-- Atualiza automaticamente o campo data_atualizacao
CREATE OR REPLACE FUNCTION atualizar_data_modificacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. CRIAÇÃO DE TRIGGER
-- ============================================

-- Trigger: trigger_atualizar_candidato
-- Executa na atualização de perfis de candidatos
CREATE TRIGGER trigger_atualizar_candidato
    BEFORE UPDATE ON perfis_candidatos
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_modificacao();

-- Trigger: trigger_atualizar_empresa
-- Executa na atualização de perfis de empresas
CREATE TRIGGER trigger_atualizar_empresa
    BEFORE UPDATE ON perfis_empresas
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_modificacao();

-- ============================================
-- 4. STORED PROCEDURE COM JOIN
-- ============================================

-- Procedure: obter_perfil_completo_candidato
-- Retorna informações completas do candidato com seu papel
CREATE OR REPLACE FUNCTION obter_perfil_completo_candidato(p_user_id INTEGER)
RETURNS TABLE (
    id_candidato INTEGER,
    nome_completo VARCHAR,
    papel VARCHAR,
    cidade VARCHAR,
    estado VARCHAR,
    avaliacao DECIMAL,
    esta_ativo BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pc.id_candidato,
        pc.nome_completo,
        pu.papel,
        pc.cidade,
        pc.estado,
        pc.avaliacao,
        pc.esta_ativo
    FROM perfis_candidatos pc
    INNER JOIN papeis_usuarios pu ON pc.user_id = pu.user_id
    WHERE pc.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- View: view_empresas_ativas
-- Mostra empresas ativas com seus papéis
CREATE VIEW view_empresas_ativas AS
SELECT 
    pe.id_empresa,
    pe.nome_fantasia,
    pe.cnpj,
    pe.setor,
    pe.cidade,
    pe.estado,
    pe.avaliacao,
    pu.papel,
    pe.data_criacao
FROM perfis_empresas pe
INNER JOIN papeis_usuarios pu ON pe.user_id = pu.user_id
WHERE pe.esta_ativo = TRUE;

-- ============================================
-- 5. INSERÇÃO DE DADOS (5 registros por tabela)
-- ============================================

-- Inserções em papeis_usuarios
INSERT INTO papeis_usuarios (user_id, papel) VALUES
(1, 'admin'),
(2, 'candidate'),
(3, 'candidate'),
(4, 'company'),
(5, 'company');

INSERT INTO papeis_usuarios (user_id, papel) VALUES
(6, 'candidate'),
(7, 'candidate'),
(8, 'company'),
(9, 'candidate'),
(10, 'company');

-- Inserções em perfis_candidatos
INSERT INTO perfis_candidatos (user_id, nome_completo, nome_social, cidade, estado, nivel_experiencia, area_trabalho, linkedin_url, sobre_mim) VALUES
(2, 'João Silva Santos', 'João Silva', 'São Paulo', 'SP', 'Pleno', 'Desenvolvimento Web', 'https://linkedin.com/in/joaosilva', 'Desenvolvedor Full Stack com 5 anos de experiência'),
(3, 'Maria Oliveira Costa', NULL, 'Rio de Janeiro', 'RJ', 'Sênior', 'Data Science', 'https://linkedin.com/in/mariaoliveira', 'Cientista de dados especializada em ML e IA'),
(6, 'Pedro Henrique Souza', 'Pedro Souza', 'Belo Horizonte', 'MG', 'Júnior', 'Design UX/UI', 'https://linkedin.com/in/pedrohenrique', 'Designer UX focado em experiência do usuário'),
(7, 'Ana Carolina Lima', NULL, 'Curitiba', 'PR', 'Pleno', 'Desenvolvimento Mobile', 'https://linkedin.com/in/anacarolina', 'Desenvolvedora mobile React Native e Flutter'),
(9, 'Lucas Ferreira Alves', 'Lucas Alves', 'Porto Alegre', 'RS', 'Sênior', 'DevOps', 'https://linkedin.com/in/lucasferreira', 'Engenheiro DevOps com expertise em AWS e Docker');

-- Inserções em perfis_empresas
INSERT INTO perfis_empresas (user_id, nome_fantasia, cnpj, setor, cidade, estado, descricao, sobre) VALUES
(4, 'TechSolutions Brasil', '12.345.678/0001-90', 'Tecnologia', 'São Paulo', 'SP', 'Consultoria em transformação digital', 'Empresa líder em soluções tecnológicas inovadoras'),
(5, 'DataCorp Analytics', '23.456.789/0001-01', 'Análise de Dados', 'Rio de Janeiro', 'RJ', 'Especialistas em Big Data e Analytics', 'Transformamos dados em decisões estratégicas'),
(8, 'DesignHub Studio', '34.567.890/0001-12', 'Design', 'Belo Horizonte', 'MG', 'Estúdio de design criativo', 'Criamos experiências digitais memoráveis'),
(10, 'CloudTech Innovations', '45.678.901/0001-23', 'Cloud Computing', 'Curitiba', 'PR', 'Soluções em nuvem empresarial', 'Migração e gestão de infraestrutura cloud'),
(1, 'StartupLab Ventures', '56.789.012/0001-34', 'Incubadora', 'Porto Alegre', 'RS', 'Aceleradora de startups', 'Impulsionamos o crescimento de negócios inovadores');

-- Inserções em logs_admin
INSERT INTO logs_admin (admin_id, acao, detalhes) VALUES
(1, 'CRIAR_USUARIO', '{"tipo": "candidato", "user_id": 2}'),
(1, 'APROVAR_EMPRESA', '{"empresa_id": 4, "status": "aprovado"}'),
(1, 'ATUALIZAR_PERFIL', '{"user_id": 3, "campo": "nivel_experiencia"}'),
(1, 'DESATIVAR_USUARIO', '{"user_id": 15, "motivo": "inatividade"}'),
(1, 'CRIAR_VAGA', '{"empresa_id": 4, "titulo": "Desenvolvedor Full Stack"}');

INSERT INTO logs_admin (admin_id, acao, detalhes) VALUES
(1, 'REVISAR_DEPOIMENTO', '{"testimonial_id": 101, "status": "aprovado"}'),
(1, 'EXCLUIR_VAGA', '{"vaga_id": 203, "motivo": "duplicada"}'),
(1, 'ATUALIZAR_EMPRESA', '{"empresa_id": 5, "campo": "setor"}'),
(1, 'CRIAR_MATCH', '{"candidato_id": 2, "vaga_id": 305}'),
(1, 'EXPORTAR_RELATORIO', '{"tipo": "usuarios_ativos", "periodo": "mensal"}');

-- ============================================
-- 6. CONSULTAS DE EXEMPLO
-- ============================================

-- Consulta usando a função criada
-- SELECT * FROM obter_perfil_completo_candidato(2);

-- Consulta usando a view
-- SELECT * FROM view_empresas_ativas;

-- Consulta com JOIN manual
-- SELECT 
--     pc.nome_completo,
--     pc.cidade,
--     pc.estado,
--     pu.papel
-- FROM perfis_candidatos pc
-- INNER JOIN papeis_usuarios pu ON pc.user_id = pu.user_id
-- WHERE pc.esta_ativo = TRUE;
