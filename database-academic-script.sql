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

-- ============================================
-- 3. CRIAÇÃO DE FUNÇÕES
-- ============================================

-- Função: atualizar_avaliacao_candidato
-- Descrição: Atualiza a média de avaliações de um candidato
CREATE OR REPLACE FUNCTION atualizar_avaliacao_candidato(p_candidato_id INTEGER)
RETURNS VOID AS $$
DECLARE
    media_nota DECIMAL(2,1);
    total_count INTEGER;
BEGIN
    -- Calcula a média das avaliações
    SELECT 
        ROUND(AVG(nota)::numeric, 1),
        COUNT(*)
    INTO media_nota, total_count
    FROM avaliacoes
    WHERE avaliado_id = p_candidato_id;
    
    -- Atualiza o perfil do candidato
    UPDATE perfis_candidatos
    SET 
        avaliacao = COALESCE(media_nota, 5.0),
        total_avaliacoes = total_count
    WHERE id_candidato = p_candidato_id;
END;
$$ LANGUAGE plpgsql;

-- Função: atualizar_avaliacao_empresa
-- Descrição: Atualiza a média de avaliações de uma empresa
CREATE OR REPLACE FUNCTION atualizar_avaliacao_empresa(p_empresa_id INTEGER)
RETURNS VOID AS $$
DECLARE
    media_nota DECIMAL(2,1);
    total_count INTEGER;
BEGIN
    -- Calcula a média das avaliações
    SELECT 
        ROUND(AVG(nota)::numeric, 1),
        COUNT(*)
    INTO media_nota, total_count
    FROM avaliacoes
    WHERE avaliado_id = p_empresa_id;
    
    -- Atualiza o perfil da empresa
    UPDATE perfis_empresas
    SET 
        avaliacao = COALESCE(media_nota, 5.0),
        total_avaliacoes = total_count
    WHERE user_id = p_empresa_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. CRIAÇÃO DE TRIGGERS
-- ============================================

-- Trigger: trigger_atualizar_avaliacao
-- Descrição: Dispara automaticamente quando uma nova avaliação é inserida
CREATE OR REPLACE FUNCTION trigger_atualizar_avaliacao()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica se o avaliado é candidato ou empresa
    IF EXISTS (SELECT 1 FROM perfis_candidatos WHERE id_candidato = NEW.avaliado_id) THEN
        PERFORM atualizar_avaliacao_candidato(NEW.avaliado_id);
    ELSIF EXISTS (SELECT 1 FROM perfis_empresas WHERE user_id = NEW.avaliado_id) THEN
        PERFORM atualizar_avaliacao_empresa(NEW.avaliado_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER avaliacao_inserida
AFTER INSERT ON avaliacoes
FOR EACH ROW
EXECUTE FUNCTION trigger_atualizar_avaliacao();

-- Trigger: trigger_criar_notificacao_candidatura
-- Descrição: Cria notificação quando candidato se candidata a uma vaga
CREATE OR REPLACE FUNCTION trigger_criar_notificacao_candidatura()
RETURNS TRIGGER AS $$
DECLARE
    v_nome_candidato VARCHAR(255);
    v_titulo_vaga VARCHAR(255);
    v_empresa_id INTEGER;
BEGIN
    -- Busca informações do candidato
    SELECT nome_completo INTO v_nome_candidato
    FROM perfis_candidatos
    WHERE id_candidato = NEW.candidato_id;
    
    -- Busca informações da vaga
    SELECT titulo, empresa_id INTO v_titulo_vaga, v_empresa_id
    FROM vagas
    WHERE id_vaga = NEW.vaga_id;
    
    -- Cria notificação para a empresa
    INSERT INTO notificacoes (user_id, titulo, mensagem, tipo, relacionado_id)
    VALUES (
        v_empresa_id,
        'Nova Candidatura',
        v_nome_candidato || ' se candidatou para a vaga ' || v_titulo_vaga,
        'new_application',
        NEW.id_candidatura
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER candidatura_criada
AFTER INSERT ON candidaturas
FOR EACH ROW
EXECUTE FUNCTION trigger_criar_notificacao_candidatura();

-- ============================================
-- 5. STORED PROCEDURES / VIEWS COM JOIN
-- ============================================

-- View: view_candidaturas_completas
-- Descrição: Visão completa de candidaturas com dados de candidato, vaga e empresa
CREATE OR REPLACE VIEW view_candidaturas_completas AS
SELECT 
    c.id_candidatura,
    c.status,
    c.aceito_candidato,
    c.data_criacao,
    -- Dados do candidato
    pc.id_candidato,
    pc.nome_completo AS nome_candidato,
    pc.cidade AS cidade_candidato,
    pc.estado AS estado_candidato,
    pc.nivel_experiencia,
    pc.avaliacao AS avaliacao_candidato,
    -- Dados da vaga
    v.id_vaga,
    v.titulo AS titulo_vaga,
    v.descricao AS descricao_vaga,
    v.salario,
    v.tipo_trabalho,
    v.remoto,
    -- Dados da empresa
    pe.id_empresa,
    pe.nome_fantasia AS nome_empresa,
    pe.cidade AS cidade_empresa,
    pe.estado AS estado_empresa,
    pe.setor,
    pe.avaliacao AS avaliacao_empresa
FROM candidaturas c
INNER JOIN perfis_candidatos pc ON c.candidato_id = pc.id_candidato
INNER JOIN vagas v ON c.vaga_id = v.id_vaga
INNER JOIN perfis_empresas pe ON v.empresa_id = pe.user_id;

-- Stored Procedure: buscar_candidatos_qualificados
-- Descrição: Busca candidatos qualificados para uma vaga específica usando JOIN
CREATE OR REPLACE FUNCTION buscar_candidatos_qualificados(p_vaga_id INTEGER)
RETURNS TABLE (
    id_candidato INTEGER,
    nome_completo VARCHAR(255),
    nivel_experiencia VARCHAR(50),
    area_trabalho VARCHAR(100),
    avaliacao DECIMAL(2,1),
    cidade VARCHAR(100),
    estado VARCHAR(2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pc.id_candidato,
        pc.nome_completo,
        pc.nivel_experiencia,
        pc.area_trabalho,
        pc.avaliacao,
        pc.cidade,
        pc.estado
    FROM perfis_candidatos pc
    INNER JOIN vagas v ON v.id_vaga = p_vaga_id
    LEFT JOIN candidaturas c ON c.candidato_id = pc.id_candidato AND c.vaga_id = v.id_vaga
    WHERE 
        pc.esta_ativo = TRUE
        AND c.id_candidatura IS NULL  -- Ainda não se candidatou
        AND pc.nivel_experiencia = v.nivel_experiencia_requerido
    ORDER BY pc.avaliacao DESC;
END;
$$ LANGUAGE plpgsql;

-- Stored Procedure: relatorio_vagas_empresa
-- Descrição: Gera relatório de vagas de uma empresa com estatísticas usando JOIN
CREATE OR REPLACE FUNCTION relatorio_vagas_empresa(p_empresa_id INTEGER)
RETURNS TABLE (
    id_vaga INTEGER,
    titulo_vaga VARCHAR(255),
    total_candidaturas BIGINT,
    candidaturas_pendentes BIGINT,
    candidaturas_aceitas BIGINT,
    candidaturas_rejeitadas BIGINT,
    data_criacao TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id_vaga,
        v.titulo AS titulo_vaga,
        COUNT(c.id_candidatura) AS total_candidaturas,
        COUNT(CASE WHEN c.status = 'pending' THEN 1 END) AS candidaturas_pendentes,
        COUNT(CASE WHEN c.status = 'accepted' THEN 1 END) AS candidaturas_aceitas,
        COUNT(CASE WHEN c.status = 'rejected' THEN 1 END) AS candidaturas_rejeitadas,
        v.data_criacao
    FROM vagas v
    LEFT JOIN candidaturas c ON v.id_vaga = c.vaga_id
    WHERE v.empresa_id = p_empresa_id
    GROUP BY v.id_vaga, v.titulo, v.data_criacao
    ORDER BY v.data_criacao DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. INSERÇÃO DE DADOS DE EXEMPLO
-- ============================================

-- Inserindo papéis de usuários (mínimo 5 registros)
INSERT INTO papeis_usuarios (user_id, papel) VALUES
(1001, 'admin'),
(1002, 'candidate'),
(1003, 'candidate'),
(1004, 'candidate'),
(1005, 'candidate'),
(1006, 'candidate'),
(2001, 'company'),
(2002, 'company'),
(2003, 'company'),
(2004, 'company'),
(2005, 'company');

-- Inserindo perfis de candidatos (mínimo 5 registros)
INSERT INTO perfis_candidatos (user_id, nome_completo, nome_social, cidade, estado, nivel_experiencia, area_trabalho, linkedin_url, sobre_mim) VALUES
(1002, 'João Silva Santos', NULL, 'São Paulo', 'SP', 'Junior', 'Desenvolvimento Web', 'https://linkedin.com/in/joaosilva', 'Desenvolvedor front-end apaixonado por tecnologia e inovação'),
(1003, 'Maria Oliveira Costa', NULL, 'Rio de Janeiro', 'RJ', 'Pleno', 'Desenvolvimento Mobile', 'https://linkedin.com/in/mariaoliveira', 'Desenvolvedora mobile com 3 anos de experiência em React Native'),
(1004, 'Pedro Henrique Souza', NULL, 'Belo Horizonte', 'MG', 'Senior', 'DevOps', 'https://linkedin.com/in/pedrohenrique', 'Especialista em infraestrutura e cloud computing'),
(1005, 'Ana Paula Ferreira', 'Ana', 'Curitiba', 'PR', 'Junior', 'UI/UX Design', 'https://linkedin.com/in/anapaula', 'Designer UI/UX focada em experiência do usuário'),
(1006, 'Carlos Eduardo Lima', NULL, 'Porto Alegre', 'RS', 'Pleno', 'Data Science', 'https://linkedin.com/in/carloseduardo', 'Cientista de dados especializado em machine learning');

-- Inserindo perfis de empresas (mínimo 5 registros)
INSERT INTO perfis_empresas (user_id, nome_fantasia, cnpj, setor, cidade, estado, descricao, sobre) VALUES
(2001, 'TechInova Solutions', '12.345.678/0001-90', 'Tecnologia', 'São Paulo', 'SP', 'Empresa de desenvolvimento de software', 'Líder em soluções tecnológicas inovadoras'),
(2002, 'DataCorp Analytics', '23.456.789/0001-01', 'Tecnologia', 'Rio de Janeiro', 'RJ', 'Consultoria em análise de dados', 'Especialistas em Big Data e BI'),
(2003, 'MobileTech Apps', '34.567.890/0001-12', 'Tecnologia', 'Florianópolis', 'SC', 'Desenvolvimento de aplicativos móveis', 'Criamos apps que transformam negócios'),
(2004, 'CloudSys Infrastructure', '45.678.901/0001-23', 'Tecnologia', 'Brasília', 'DF', 'Infraestrutura em nuvem', 'Soluções completas em cloud computing'),
(2005, 'DesignHub Studio', '56.789.012/0001-34', 'Design', 'Belo Horizonte', 'MG', 'Estúdio de design digital', 'Design que encanta e converte');

-- Inserindo vagas (mínimo 5 registros)
INSERT INTO vagas (empresa_id, titulo, descricao, localizacao, salario, tipo_trabalho, remoto) VALUES
(2001, 'Desenvolvedor Front-end React', 'Buscamos desenvolvedor React para projetos inovadores', 'São Paulo, SP', 'R$ 5.000 - R$ 7.000', 'CLT', TRUE),
(2001, 'Desenvolvedor Back-end Node.js', 'Desenvolvedor back-end com experiência em Node.js e APIs REST', 'São Paulo, SP', 'R$ 6.000 - R$ 8.000', 'CLT', TRUE),
(2002, 'Cientista de Dados Senior', 'Cientista de dados para análise avançada e machine learning', 'Rio de Janeiro, RJ', 'R$ 10.000 - R$ 14.000', 'CLT', FALSE),
(2003, 'Desenvolvedor Mobile React Native', 'Dev mobile para apps iOS e Android', 'Florianópolis, SC', 'R$ 7.000 - R$ 9.000', 'PJ', TRUE),
(2004, 'Engenheiro DevOps', 'Engenheiro para infraestrutura cloud e automação', 'Brasília, DF', 'R$ 9.000 - R$ 12.000', 'CLT', TRUE),
(2005, 'UI/UX Designer', 'Designer para criar interfaces incríveis', 'Belo Horizonte, MG', 'R$ 4.500 - R$ 6.500', 'CLT', FALSE);

-- Inserindo candidaturas (mínimo 5 registros)
INSERT INTO candidaturas (candidato_id, vaga_id, status) VALUES
(1, 1, 'accepted'),
(2, 4, 'pending'),
(3, 5, 'accepted'),
(4, 6, 'pending'),
(5, 3, 'rejected'),
(1, 2, 'pending'),
(2, 1, 'rejected'),
(3, 2, 'accepted');

-- Inserindo deslizes/swipes (mínimo 5 registros)
INSERT INTO deslizes (user_id, alvo_id, tipo_alvo, acao) VALUES
(1002, 1, 'job', 'like'),
(1002, 2, 'job', 'like'),
(1003, 4, 'job', 'like'),
(1004, 6, 'job', 'like'),
(1005, 3, 'job', 'super_like'),
(2001, 1002, 'candidate', 'like'),
(2002, 1005, 'candidate', 'like');

-- Inserindo correspondências/matches (mínimo 5 registros)
INSERT INTO correspondencias (candidato_id, vaga_id, empresa_id, status) VALUES
(1, 1, 2001, 'active'),
(3, 5, 2004, 'active'),
(3, 2, 2001, 'active'),
(1, 2, 2001, 'active'),
(4, 6, 2005, 'active');

-- Inserindo avaliações (mínimo 5 registros)
INSERT INTO avaliacoes (avaliador_id, avaliado_id, candidatura_id, nota, comentario) VALUES
(2001, 1002, 1, 4.5, 'Excelente profissional, muito dedicado'),
(1002, 2001, 1, 5.0, 'Empresa maravilhosa, ambiente colaborativo'),
(2004, 1004, 3, 4.8, 'Conhecimento técnico excepcional'),
(1004, 2004, 3, 4.5, 'Ótimo ambiente de trabalho e desafios interessantes'),
(2001, 1002, 6, 3.5, 'Bom profissional, mas precisa melhorar comunicação');

-- Inserindo notificações (mínimo 5 registros)
INSERT INTO notificacoes (user_id, titulo, mensagem, tipo, relacionado_id, lida) VALUES
(1002, 'Nova Correspondência', 'Você tem um novo match com TechInova Solutions', 'new_match', 1, FALSE),
(2001, 'Nova Candidatura', 'João Silva Santos se candidatou para Desenvolvedor Front-end React', 'new_application', 1, FALSE),
(1003, 'Candidatura Aceita', 'Sua candidatura foi aceita pela CloudSys Infrastructure', 'application_accepted', 3, FALSE),
(2004, 'Nova Correspondência', 'Você tem um novo match com Pedro Henrique Souza', 'new_match', 2, TRUE),
(1004, 'Avaliação Recebida', 'Você recebeu uma avaliação de CloudSys Infrastructure', 'new_rating', 4, FALSE);

-- Inserindo depoimentos (mínimo 5 registros)
INSERT INTO depoimentos (candidato_id, empresa_id, candidatura_id, titulo_vaga, comentario, status) VALUES
(1, 2001, 1, 'Desenvolvedor Front-end React', 'Experiência incrível, aprendi muito e cresci profissionalmente', 'approved'),
(3, 2004, 3, 'Engenheiro DevOps', 'Empresa séria com ótimos projetos e equipe colaborativa', 'approved'),
(5, 2002, 5, 'Cientista de Dados Senior', 'Processo seletivo transparente, mas a vaga não era o que esperava', 'pending'),
(1, 2001, 6, 'Desenvolvedor Back-end Node.js', 'Ambiente desafiador com tecnologias de ponta', 'approved'),
(2, 2003, 2, 'Desenvolvedor Mobile React Native', 'Boa empresa, mas poderia melhorar a comunicação interna', 'pending');

-- Inserindo logs administrativos (mínimo 5 registros)
INSERT INTO logs_admin (admin_id, acao, detalhes) VALUES
(1001, 'criar_empresa', '{"empresa_id": 2001, "nome": "TechInova Solutions"}'),
(1001, 'aprovar_depoimento', '{"depoimento_id": 1, "candidato": "João Silva Santos"}'),
(1001, 'desativar_usuario', '{"user_id": 9999, "motivo": "Violação das regras"}'),
(1001, 'criar_vaga', '{"vaga_id": 1, "empresa": "TechInova Solutions"}'),
(1001, 'moderacao_conteudo', '{"tipo": "depoimento", "id": 3, "acao": "revisão"}'
);

-- ============================================
-- 7. CONSULTAS DE EXEMPLO USANDO AS PROCEDURES
-- ============================================

-- Exemplo 1: Buscar candidatos qualificados para uma vaga
-- SELECT * FROM buscar_candidatos_qualificados(1);

-- Exemplo 2: Relatório de vagas de uma empresa
-- SELECT * FROM relatorio_vagas_empresa(2001);

-- Exemplo 3: Visualizar todas as candidaturas completas
-- SELECT * FROM view_candidaturas_completas;

-- Exemplo 4: Atualizar avaliação de um candidato manualmente
-- SELECT atualizar_avaliacao_candidato(1);

-- ============================================
-- FIM DO SCRIPT
-- ============================================
