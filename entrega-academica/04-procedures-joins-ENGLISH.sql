-- ============================================
-- PROJETO LINKA+ - DATABASE
-- REQUIREMENT: STORED PROCEDURES AND VIEWS WITH JOIN
-- ============================================
-- Student: [YOUR NAME]
-- Course: Database
-- ============================================

-- ============================================
-- VIEW 1: Complete Applications (3 JOINs)
-- ============================================
-- Description: View that combines data from applications, candidates, jobs and companies
-- JOIN Type: INNER JOIN (joins only matching records)
-- Tables involved: 4 tables

CREATE OR REPLACE VIEW view_complete_applications AS
SELECT 
    -- Application data
    a.id AS application_id,
    a.status AS application_status,
    a.candidate_accepted,
    a.created_at AS application_date,
    
    -- Candidate data (JOIN 1)
    p.id AS candidate_id,
    p.full_name AS candidate_name,
    p.city AS candidate_city,
    p.state AS candidate_state,
    p.experience_level,
    p.rating AS candidate_rating,
    
    -- Job data (JOIN 2)
    j.id AS job_id,
    j.title AS job_title,
    j.description AS job_description,
    j.salary,
    j.job_type,
    j.is_remote,
    
    -- Company data (JOIN 3)
    cp.id AS company_id,
    cp.fantasy_name AS company_name,
    cp.city AS company_city,
    cp.state AS company_state,
    cp.sector,
    cp.rating AS company_rating

FROM applications a
INNER JOIN profiles p ON a.candidate_id = p.id
INNER JOIN jobs j ON a.job_id = j.id
INNER JOIN company_profiles cp ON j.company_id = cp.user_id;

-- Usage example:
-- SELECT * FROM view_complete_applications;
-- SELECT * FROM view_complete_applications WHERE application_status = 'pending';

-- ============================================
-- STORED PROCEDURE 1: Find Qualified Candidates
-- ============================================
-- Description: Finds qualified candidates for a job using INNER and LEFT JOIN
-- Parameter: p_job_id (UUID) - Job ID
-- Return: TABLE with qualified candidates data
-- JOIN Type: INNER JOIN + LEFT JOIN

CREATE OR REPLACE FUNCTION find_qualified_candidates(p_job_id UUID)
RETURNS TABLE (
    candidate_id UUID,
    full_name VARCHAR(255),
    experience_level VARCHAR(50),
    work_area VARCHAR(100),
    rating DECIMAL(2,1),
    city VARCHAR(100),
    state VARCHAR(2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.full_name,
        p.experience_level,
        p.work_area,
        p.rating,
        p.city,
        p.state
    FROM profiles p
    -- JOIN 1: Get job information
    INNER JOIN jobs j ON j.id = p_job_id
    -- JOIN 2: Check if candidate already applied (LEFT = returns even without application)
    LEFT JOIN applications a ON a.candidate_id = p.id AND a.job_id = j.id
    WHERE 
        p.is_active = TRUE                      -- Active candidate
        AND a.id IS NULL                        -- Has not applied yet
    ORDER BY p.rating DESC;                     -- Order by best rating
END;
$$ LANGUAGE plpgsql;

-- Usage example:
-- SELECT * FROM find_qualified_candidates('uuid-here');

-- ============================================
-- STORED PROCEDURE 2: Company Jobs Report
-- ============================================
-- Description: Generates job report with statistics using LEFT JOIN and aggregations
-- Parameter: p_company_id (UUID) - Company ID (user_id)
-- Return: TABLE with job statistics
-- JOIN Type: LEFT JOIN + GROUP BY

CREATE OR REPLACE FUNCTION company_jobs_report(p_company_id UUID)
RETURNS TABLE (
    job_id UUID,
    job_title VARCHAR(255),
    total_applications BIGINT,
    pending_applications BIGINT,
    accepted_applications BIGINT,
    rejected_applications BIGINT,
    avg_candidate_rating DECIMAL(2,1),
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.id,
        j.title,
        COUNT(a.id) AS total_applications,
        COUNT(a.id) FILTER (WHERE a.status = 'pending') AS pending_applications,
        COUNT(a.id) FILTER (WHERE a.status = 'accepted') AS accepted_applications,
        COUNT(a.id) FILTER (WHERE a.status = 'rejected') AS rejected_applications,
        ROUND(AVG(p.rating)::numeric, 1) AS avg_candidate_rating,
        j.created_at
    FROM jobs j
    -- LEFT JOIN: Brings jobs even without applications
    LEFT JOIN applications a ON a.job_id = j.id
    -- LEFT JOIN: Brings candidate data when there's an application
    LEFT JOIN profiles p ON a.candidate_id = p.id
    WHERE 
        j.company_id = p_company_id
    GROUP BY j.id, j.title, j.created_at
    ORDER BY j.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Usage example:
-- SELECT * FROM company_jobs_report('uuid-here');

-- ============================================
-- STORED PROCEDURE 3: Candidate Application History
-- ============================================
-- Description: Returns application history for a specific candidate
-- Parameter: p_candidate_id (UUID) - Candidate ID
-- Return: TABLE with application history
-- JOIN Type: INNER JOIN (3 tables)

CREATE OR REPLACE FUNCTION candidate_history(p_candidate_id UUID)
RETURNS TABLE (
    application_id UUID,
    application_date TIMESTAMP,
    application_status VARCHAR(50),
    job_title VARCHAR(255),
    company_name VARCHAR(255),
    company_city VARCHAR(100),
    company_state VARCHAR(2),
    salary TEXT,
    job_type TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.created_at,
        a.status,
        j.title,
        cp.fantasy_name,
        cp.city,
        cp.state,
        j.salary,
        j.job_type
    FROM applications a
    INNER JOIN jobs j ON a.job_id = j.id
    INNER JOIN company_profiles cp ON j.company_id = cp.user_id
    WHERE 
        a.candidate_id = p_candidate_id
    ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Usage example:
-- SELECT * FROM candidate_history('uuid-here');

-- ============================================
-- REQUIREMENT VERIFICATION
-- ============================================

-- ✅ REQUIREMENT: At least 1 Stored Procedure or View with JOIN
--    → Created:
--      1 VIEW: view_complete_applications (3 INNER JOINs)
--      3 FUNCTIONS (Stored Procedures):
--        1. find_qualified_candidates (1 INNER JOIN + 1 LEFT JOIN)
--        2. company_jobs_report (2 LEFT JOINs + GROUP BY)
--        3. candidate_history (2 INNER JOINs)
--
--    All use SQL queries with JOINs between multiple tables
--    All written in PL/pgSQL
--    All return structured data (VIEW or TABLE)

-- ============================================
-- EXPLANATION OF JOIN TYPES
-- ============================================

-- 1. INNER JOIN
--    - Returns only records that have matches in both tables
--    - Example: applications INNER JOIN profiles
--      → Returns only applications from existing candidates

-- 2. LEFT JOIN (or LEFT OUTER JOIN)
--    - Returns all records from left table + matches from right table
--    - If no match, returns NULL for right table columns
--    - Example: jobs LEFT JOIN applications
--      → Returns ALL jobs, even without applications

-- 3. RIGHT JOIN (or RIGHT OUTER JOIN)
--    - Returns all records from right table + matches from left table
--    - Less common, can be rewritten as LEFT JOIN

-- 4. FULL OUTER JOIN
--    - Returns all records from both tables
--    - Where there's no match, returns NULL
--    - Less used in practice

-- ============================================
-- END OF FILE
-- ============================================
