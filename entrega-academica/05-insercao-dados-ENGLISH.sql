-- ============================================
-- PROJETO LINKA+ - DATABASE
-- REQUIREMENT: DATA INSERTION
-- ============================================
-- Student: [YOUR NAME]
-- Course: Database
-- ============================================

-- IMPORTANT NOTE:
-- This script uses ENGLISH table and column names to match the REAL database schema
-- Use these UUIDs that exist in your database (get from auth.users table)

-- ============================================
-- INSERTING USER ROLES (at least 5 records)
-- ============================================

-- CRITICAL: Replace these UUIDs with real UUIDs from your auth.users table
-- You need at least:
-- - 1 admin user
-- - 3 candidate users  
-- - 2 company users

INSERT INTO user_roles (user_id, role) VALUES
-- Admin (1 record)
('00000000-0000-0000-0000-000000000001', 'admin'),

-- Candidates (3 records)
('11111111-1111-1111-1111-111111111111', 'candidate'),
('11111111-1111-1111-1111-111111111112', 'candidate'),
('11111111-1111-1111-1111-111111111113', 'candidate'),

-- Companies (2 records)
('22222222-2222-2222-2222-222222222221', 'company'),
('22222222-2222-2222-2222-222222222222', 'company')
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- INSERTING CANDIDATE PROFILES (at least 5 records)
-- ============================================

INSERT INTO profiles (
    id, 
    full_name, 
    city, 
    state, 
    experience_level, 
    work_area,
    about_me,
    linkedin_url
) VALUES
('11111111-1111-1111-1111-111111111111', 'Ana Silva Santos', 'São Paulo', 'SP', 'Pleno', 'Desenvolvimento Web', 'Desenvolvedora Full Stack com 3 anos de experiência', 'https://linkedin.com/in/anasilva'),
('11111111-1111-1111-1111-111111111112', 'Carlos Eduardo Oliveira', 'Rio de Janeiro', 'RJ', 'Sênior', 'DevOps', 'Especialista em infraestrutura cloud', 'https://linkedin.com/in/carloseduardo'),
('11111111-1111-1111-1111-111111111113', 'Mariana Costa Lima', 'Belo Horizonte', 'MG', 'Júnior', 'UI/UX Design', 'Designer apaixonada por criar experiências incríveis', 'https://linkedin.com/in/marianacosta'),
('11111111-1111-1111-1111-111111111114', 'Pedro Henrique Santos', 'Porto Alegre', 'RS', 'Pleno', 'Análise de Dados', 'Analista de dados com foco em business intelligence', 'https://linkedin.com/in/pedrosantos'),
('11111111-1111-1111-1111-111111111115', 'Juliana Ferreira Souza', 'Curitiba', 'PR', 'Júnior', 'Marketing Digital', 'Profissional de marketing com experiência em redes sociais', 'https://linkedin.com/in/julianaferreira')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- INSERTING COMPANY PROFILES (at least 5 records)
-- ============================================

INSERT INTO company_profiles (
    user_id, 
    fantasy_name, 
    cnpj, 
    sector, 
    city, 
    state, 
    description,
    about
) VALUES
('22222222-2222-2222-2222-222222222221', 'TechInova Solutions', '12.345.678/0001-90', 'Technology', 'São Paulo', 'SP', 'Software development company', 'Leaders in digital transformation'),
('22222222-2222-2222-2222-222222222222', 'DataCo Analytics', '23.456.789/0001-01', 'Data Science', 'Rio de Janeiro', 'RJ', 'Data analysis and AI', 'Transforming data into insights'),
('22222222-2222-2222-2222-222222222223', 'DesignHub Studio', '34.567.890/0001-12', 'Design', 'Belo Horizonte', 'MG', 'Creative design agency', 'Creating visual experiences'),
('22222222-2222-2222-2222-222222222224', 'CloudMasters Inc', '45.678.901/0001-23', 'Cloud Computing', 'Porto Alegre', 'RS', 'Cloud infrastructure specialists', 'Building the future in the cloud'),
('22222222-2222-2222-2222-222222222225', 'Marketing Plus Digital', '56.789.012/0001-34', 'Marketing', 'Curitiba', 'PR', 'Digital marketing agency', 'Growing brands digitally')
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- INSERTING JOBS (at least 5 records)
-- ============================================

INSERT INTO jobs (
    company_id, 
    title, 
    description, 
    job_type, 
    location, 
    salary,
    is_remote,
    required_experience_level
) VALUES
('22222222-2222-2222-2222-222222222221', 'Full Stack Developer', 'Develop web applications with React and Node.js', 'CLT', 'São Paulo, SP', 'R$ 8.000 - R$ 12.000', true, 'Pleno'),
('22222222-2222-2222-2222-222222222222', 'Data Scientist', 'Analyze data and build ML models', 'PJ', 'Rio de Janeiro, RJ', 'R$ 10.000 - R$ 15.000', true, 'Sênior'),
('22222222-2222-2222-2222-222222222223', 'UI/UX Designer', 'Design intuitive and beautiful interfaces', 'CLT', 'Belo Horizonte, MG', 'R$ 5.000 - R$ 7.000', false, 'Júnior'),
('22222222-2222-2222-2222-222222222224', 'DevOps Engineer', 'Manage cloud infrastructure and CI/CD', 'CLT', 'Porto Alegre, RS', 'R$ 9.000 - R$ 13.000', true, 'Pleno'),
('22222222-2222-2222-2222-222222222225', 'Social Media Manager', 'Manage social media campaigns', 'PJ', 'Curitiba, PR', 'R$ 4.000 - R$ 6.000', true, 'Júnior')
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERTING APPLICATIONS (at least 5 records)
-- ============================================

-- Note: Use actual job IDs from your jobs table
-- Get them with: SELECT id, title FROM jobs LIMIT 5;

INSERT INTO applications (
    candidate_id, 
    job_id, 
    status
) VALUES
('11111111-1111-1111-1111-111111111111', (SELECT id FROM jobs WHERE title = 'Full Stack Developer' LIMIT 1), 'pending'),
('11111111-1111-1111-1111-111111111112', (SELECT id FROM jobs WHERE title = 'DevOps Engineer' LIMIT 1), 'accepted'),
('11111111-1111-1111-1111-111111111113', (SELECT id FROM jobs WHERE title = 'UI/UX Designer' LIMIT 1), 'pending'),
('11111111-1111-1111-1111-111111111114', (SELECT id FROM jobs WHERE title = 'Data Scientist' LIMIT 1), 'rejected'),
('11111111-1111-1111-1111-111111111115', (SELECT id FROM jobs WHERE title = 'Social Media Manager' LIMIT 1), 'accepted')
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERTING RATINGS (at least 5 records)
-- ============================================

-- Note: Ratings require completed applications with contract_status = 'completed'
-- First update some applications to completed status:

UPDATE applications 
SET contract_status = 'completed', completed_at = NOW()
WHERE status = 'accepted'
LIMIT 2;

-- Now insert ratings (get actual application IDs first)
INSERT INTO ratings (
    application_id,
    rater_id,
    rated_user_id,
    rating,
    comment
) VALUES
-- Company rating candidate
((SELECT id FROM applications WHERE status = 'accepted' LIMIT 1), '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111112', 4.5, 'Excellent professional, delivered on time'),
-- Candidate rating company
((SELECT id FROM applications WHERE status = 'accepted' LIMIT 1), '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 5.0, 'Great company to work with'),
-- More ratings
((SELECT id FROM applications WHERE status = 'accepted' OFFSET 1 LIMIT 1), '22222222-2222-2222-2222-222222222225', '11111111-1111-1111-1111-111111111115', 4.0, 'Good work ethic'),
((SELECT id FROM applications WHERE status = 'accepted' OFFSET 1 LIMIT 1), '11111111-1111-1111-1111-111111111115', '22222222-2222-2222-2222-222222222225', 4.5, 'Professional environment'),
((SELECT id FROM applications WHERE status = 'accepted' LIMIT 1), '22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 5.0, 'Outstanding developer')
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERTING NOTIFICATIONS (at least 5 records)
-- ============================================

INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    related_id
) VALUES
('11111111-1111-1111-1111-111111111111', 'New Match!', 'You matched with TechInova Solutions', 'match', (SELECT id FROM jobs WHERE title = 'Full Stack Developer' LIMIT 1)),
('22222222-2222-2222-2222-222222222222', 'New Application', 'Ana Silva Santos applied for your job', 'new_application', (SELECT id FROM applications WHERE candidate_id = '11111111-1111-1111-1111-111111111111' LIMIT 1)),
('11111111-1111-1111-1111-111111111112', 'Application Accepted!', 'Your application was accepted', 'application_accepted', (SELECT id FROM applications WHERE candidate_id = '11111111-1111-1111-1111-111111111112' LIMIT 1)),
('11111111-1111-1111-1111-111111111113', 'Profile Viewed', 'DesignHub Studio viewed your profile', 'profile_view', NULL),
('22222222-2222-2222-2222-222222222221', 'New Rating', 'You received a 5-star rating', 'new_rating', (SELECT id FROM ratings WHERE rated_user_id = '22222222-2222-2222-2222-222222222221' LIMIT 1))
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERTING TESTIMONIALS (at least 5 records)
-- ============================================

-- Note: Testimonials require completed applications
INSERT INTO testimonials (
    application_id,
    candidate_id,
    company_id,
    job_title,
    comment,
    status
) VALUES
((SELECT id FROM applications WHERE contract_status = 'completed' LIMIT 1), '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 'DevOps Engineer', 'Amazing experience working here. Great team and challenging projects.', 'approved'),
((SELECT id FROM applications WHERE contract_status = 'completed' OFFSET 1 LIMIT 1), '11111111-1111-1111-1111-111111111115', '22222222-2222-2222-2222-222222222225', 'Social Media Manager', 'Learned a lot and had great support from the team.', 'approved'),
((SELECT id FROM applications WHERE status = 'accepted' LIMIT 1), '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Full Stack Developer', 'Professional environment with growth opportunities.', 'pending'),
((SELECT id FROM applications WHERE status = 'accepted' OFFSET 2 LIMIT 1), '11111111-1111-1111-1111-111111111113', '22222222-2222-2222-2222-222222222223', 'UI/UX Designer', 'Creative freedom and supportive leadership.', 'approved'),
((SELECT id FROM applications WHERE status = 'accepted' OFFSET 3 LIMIT 1), '11111111-1111-1111-1111-111111111114', '22222222-2222-2222-2222-222222222224', 'Data Scientist', 'Innovative company with cutting-edge technology.', 'pending')
ON CONFLICT (application_id) DO NOTHING;

-- ============================================
-- DATA VERIFICATION
-- ============================================

-- Check record counts in each table
SELECT 'user_roles' AS table_name, COUNT(*) AS record_count FROM user_roles
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'company_profiles', COUNT(*) FROM company_profiles
UNION ALL
SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL
SELECT 'applications', COUNT(*) FROM applications
UNION ALL
SELECT 'ratings', COUNT(*) FROM ratings
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'testimonials', COUNT(*) FROM testimonials;

-- ============================================
-- REQUIREMENT VERIFICATION
-- ============================================

-- ✅ REQUIREMENT: At least 5 records in each table
--    Verify that all tables have at least 5 records:
--    - user_roles: 6 records (1 admin + 3 candidates + 2 companies)
--    - profiles: 5 candidate records
--    - company_profiles: 5 company records
--    - jobs: 5 job postings
--    - applications: 5 applications
--    - ratings: 5 ratings
--    - notifications: 5 notifications
--    - testimonials: 5 testimonials

-- ============================================
-- END OF FILE
-- ============================================
