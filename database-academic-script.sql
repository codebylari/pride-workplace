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
-- 2. CRIAÇÃO DE FUNÇÃO
-- ============================================

-- Função: atualizar_data_modificacao
-- Descrição: Atualiza automaticamente o campo data_atualizacao
CREATE OR REPLACE FUNCTION atualizar_data_modificacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. CRIAÇÃO DE TRIGGERS
-- ============================================

-- Trigger: trigger_atualizar_candidato
-- Descrição: Executa na atualização de perfis de candidatos
CREATE TRIGGER trigger_atualizar_candidato
    BEFORE UPDATE ON perfis_candidatos
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_modificacao();

-- Trigger: trigger_atualizar_empresa
-- Descrição: Executa na atualização de perfis de empresas
CREATE TRIGGER trigger_atualizar_empresa
    BEFORE UPDATE ON perfis_empresas
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_modificacao();

-- Trigger: trigger_atualizar_vaga
-- Descrição: Executa na atualização de vagas
CREATE TRIGGER trigger_atualizar_vaga
    BEFORE UPDATE ON vagas
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_modificacao();

-- Trigger: trigger_atualizar_depoimento
-- Descrição: Executa na atualização de depoimentos
CREATE TRIGGER trigger_atualizar_depoimento
    BEFORE UPDATE ON depoimentos
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_modificacao();

-- ============================================
-- 4. STORED PROCEDURE COM JOIN
-- ============================================

-- Procedure: obter_perfil_completo_candidato
-- Descrição: Retorna informações completas do candidato com seu papel
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

-- ============================================
-- 5. VIEWS COM JOIN
-- ============================================

-- View: view_empresas_ativas
-- Descrição: Mostra empresas ativas com seus papéis
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

-- View: view_vagas_empresas
-- Descrição: Mostra vagas com informações das empresas
CREATE VIEW view_vagas_empresas AS
SELECT 
    v.id_vaga,
    v.titulo,
    v.descricao,
    v.localizacao,
    v.salario,
    pe.nome_fantasia,
    pe.cidade AS cidade_empresa,
    pe.setor,
    v.data_criacao
FROM vagas v
INNER JOIN perfis_empresas pe ON v.empresa_id = pe.user_id;

-- View: view_candidaturas_completas
-- Descrição: Mostra candidaturas com informações de candidatos e vagas
CREATE VIEW view_candidaturas_completas AS
SELECT 
    c.id_candidatura,
    pc.nome_completo AS nome_candidato,
    v.titulo AS titulo_vaga,
    pe.nome_fantasia AS nome_empresa,
    c.status,
    c.data_criacao
FROM candidaturas c
INNER JOIN perfis_candidatos pc ON c.candidato_id = pc.id_candidato
INNER JOIN vagas v ON c.vaga_id = v.id_vaga
INNER JOIN perfis_empresas pe ON v.empresa_id = pe.user_id;

-- ============================================
-- 6. INSERÇÃO DE DADOS (5 registros por tabela)
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

-- Inserções em vagas
INSERT INTO vagas (empresa_id, titulo, descricao, localizacao, salario, tipo_trabalho, remoto) VALUES
(4, 'Desenvolvedor Full Stack Sênior', 'Desenvolvimento de aplicações web com React e Node.js', 'São Paulo, SP', 'R$ 12.000 - R$ 15.000', 'CLT', TRUE),
(5, 'Cientista de Dados', 'Análise de grandes volumes de dados e criação de modelos preditivos', 'Rio de Janeiro, RJ', 'R$ 10.000 - R$ 13.000', 'CLT', FALSE),
(8, 'Designer UX/UI Pleno', 'Criação de interfaces intuitivas e experiências memoráveis', 'Belo Horizonte, MG', 'R$ 7.000 - R$ 9.000', 'PJ', TRUE),
(10, 'Engenheiro DevOps', 'Automação de infraestrutura e CI/CD', 'Curitiba, PR', 'R$ 11.000 - R$ 14.000', 'CLT', TRUE),
(4, 'Desenvolvedor Mobile React Native', 'Desenvolvimento de aplicativos móveis multiplataforma', 'São Paulo, SP', 'R$ 8.000 - R$ 11.000', 'CLT', FALSE);

-- Inserções em candidaturas
INSERT INTO candidaturas (candidato_id, vaga_id, status, aceito_candidato, status_contrato) VALUES
(1, 1, 'accepted', TRUE, 'active'),
(2, 2, 'pending', FALSE, 'pending'),
(3, 3, 'accepted', TRUE, 'completed'),
(4, 4, 'contact_requested', FALSE, 'pending'),
(5, 5, 'accepted', TRUE, 'active');

-- Inserções em deslizes
INSERT INTO deslizes (user_id, alvo_id, tipo_alvo, acao) VALUES
(2, 1, 'job', 'like'),
(3, 2, 'job', 'like'),
(4, 1, 'candidate', 'like'),
(5, 2, 'candidate', 'super_like'),
(6, 3, 'job', 'dislike');

-- Inserções em correspondencias
INSERT INTO correspondencias (candidato_id, vaga_id, empresa_id, status) VALUES
(1, 1, 4, 'active'),
(2, 2, 5, 'active'),
(3, 3, 8, 'completed'),
(4, 4, 10, 'active'),
(5, 5, 4, 'active');

-- Inserções em avaliacoes
INSERT INTO avaliacoes (avaliador_id, avaliado_id, candidatura_id, nota, comentario) VALUES
(4, 2, 1, 5.0, 'Excelente profissional, entrega de qualidade'),
(2, 4, 1, 4.5, 'Ótima empresa para trabalhar, ambiente colaborativo'),
(8, 6, 3, 4.8, 'Designer criativo com excelentes habilidades'),
(6, 8, 3, 5.0, 'Empresa inspiradora, projetos desafiadores'),
(10, 9, 4, 4.7, 'Profissional dedicado e competente');

-- Inserções em notificacoes
INSERT INTO notificacoes (user_id, titulo, mensagem, tipo, lida, relacionado_id) VALUES
(2, 'Nova Candidatura', 'Você se candidatou para a vaga Desenvolvedor Full Stack', 'new_application', FALSE, 1),
(4, 'Candidatura Recebida', 'João Silva se candidatou para sua vaga', 'new_application', FALSE, 1),
(3, 'Solicitação de Contato', 'DataCorp deseja entrar em contato', 'contact_requested', FALSE, 2),
(6, 'Candidatura Aceita', 'Sua candidatura foi aceita pela DesignHub', 'application_accepted', TRUE, 3),
(9, 'Contrato Concluído', 'Seu contrato foi concluído. Avalie sua experiência', 'rate_company', FALSE, 4);

-- Inserções em depoimentos
INSERT INTO depoimentos (candidato_id, empresa_id, candidatura_id, titulo_vaga, comentario, status) VALUES
(3, 8, 3, 'Designer UX/UI Pleno', 'Experiência incrível! Empresa com cultura fantástica e projetos desafiadores', 'approved'),
(1, 4, 1, 'Desenvolvedor Full Stack Sênior', 'Ambiente colaborativo e equipe muito competente', 'pending'),
(4, 10, 4, 'Engenheiro DevOps', 'Ótima infraestrutura e oportunidades de crescimento', 'approved'),
(5, 4, 5, 'Desenvolvedor Mobile React Native', 'Empresa inovadora com projetos interessantes', 'pending'),
(2, 5, 2, 'Cientista de Dados', 'Trabalho desafiador com grandes volumes de dados', 'approved');

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
-- 7. CONSULTAS DE EXEMPLO
-- ============================================

-- Consulta usando a função criada
-- SELECT * FROM obter_perfil_completo_candidato(2);

-- Consulta usando a view de empresas ativas
-- SELECT * FROM view_empresas_ativas;

-- Consulta usando a view de vagas com empresas
-- SELECT * FROM view_vagas_empresas;

-- Consulta usando a view de candidaturas completas
-- SELECT * FROM view_candidaturas_completas;

-- Consulta com JOIN manual para buscar candidatos e suas candidaturas
-- SELECT 
--     pc.nome_completo,
--     v.titulo AS vaga,
--     pe.nome_fantasia AS empresa,
--     c.status,
--     c.data_criacao
-- FROM candidaturas c
-- INNER JOIN perfis_candidatos pc ON c.candidato_id = pc.id_candidato
-- INNER JOIN vagas v ON c.vaga_id = v.id_vaga
-- INNER JOIN perfis_empresas pe ON v.empresa_id = pe.user_id
-- WHERE pc.user_id = 2;
