# 📚 LINKAR Database Scripts - English Version

## 🔄 Portuguese vs English Files

This folder contains **TWO versions** of the SQL scripts:

### 📝 Portuguese Files (Academic Documentation)
- `02-funcoes.sql`
- `03-triggers.sql`
- `04-procedures-joins.sql`
- `05-insercao-dados.sql`

**Purpose**: Academic documentation with Portuguese table/column names
**Status**: ⚠️ Will NOT work on the real database

### ✅ English Files (Ready for Real Database)
- `02-funcoes-ENGLISH.sql`
- `03-triggers-ENGLISH.sql`
- `04-procedures-joins-ENGLISH.sql`
- `05-insercao-dados-ENGLISH.sql`

**Purpose**: Production-ready scripts for the actual LINKAR database
**Status**: ✅ Ready to execute on the real database

---

## 🗄️ Table Name Mapping

| Portuguese (Academic) | English (Real Database) |
|----------------------|------------------------|
| `perfis_candidatos` | `profiles` |
| `perfis_empresas` | `company_profiles` |
| `papeis_usuarios` | `user_roles` |
| `vagas` | `jobs` |
| `candidaturas` | `applications` |
| `avaliacoes` | `ratings` |
| `notificacoes` | `notifications` |
| `depoimentos` | `testimonials` |
| `logs_admin` | `admin_logs` |
| `correspondencias` | `matches` |
| `deslizes` | `swipes` |

---

## 📋 Column Name Mapping

### Common Fields
| Portuguese | English |
|-----------|---------|
| `id_candidato` | `id` (in profiles) |
| `nome_completo` | `full_name` |
| `nome_fantasia` | `fantasy_name` |
| `avaliacao` | `rating` |
| `total_avaliacoes` | `total_ratings` |
| `nota` | `rating` |
| `avaliado_id` | `rated_user_id` |
| `avaliador_id` | `rater_id` |
| `candidato_id` | `candidate_id` |
| `vaga_id` | `job_id` |
| `empresa_id` | `company_id` |
| `titulo` | `title` |
| `descricao` | `description` |
| `salario` | `salary` |
| `tipo_trabalho` | `job_type` |
| `remoto` | `is_remote` |
| `nivel_experiencia` | `experience_level` |
| `area_trabalho` | `work_area` |
| `cidade` | `city` |
| `estado` | `state` |
| `setor` | `sector` |
| `esta_ativo` | `is_active` |

---

## 🚀 How to Use the English Scripts

### 1️⃣ Functions (`02-funcoes-ENGLISH.sql`)
```sql
-- Execute the entire file to create functions
-- Then test them:
SELECT update_candidate_rating('your-uuid-here');
SELECT update_company_rating('your-uuid-here');
```

### 2️⃣ Triggers (`03-triggers-ENGLISH.sql`)
```sql
-- Execute the entire file to create triggers
-- Triggers will fire automatically on INSERT

-- Test by inserting data:
INSERT INTO ratings (rater_id, rated_user_id, application_id, rating)
VALUES ('uuid1', 'uuid2', 'uuid3', 4.5);
```

### 3️⃣ Procedures & Views (`04-procedures-joins-ENGLISH.sql`)
```sql
-- Execute the entire file to create view and functions
-- Then query them:

-- Query the view
SELECT * FROM view_complete_applications;

-- Call the procedures
SELECT * FROM find_qualified_candidates('job-uuid');
SELECT * FROM company_jobs_report('company-uuid');
SELECT * FROM candidate_history('candidate-uuid');
```

### 4️⃣ Data Insertion (`05-insercao-dados-ENGLISH.sql`)
```sql
-- ⚠️ IMPORTANT: Before running, you MUST:
-- 1. Get real UUIDs from your auth.users table
-- 2. Replace the placeholder UUIDs in the script
-- 3. Make sure users exist before inserting profiles

-- Get existing user IDs:
SELECT id, email FROM auth.users;

-- Then execute the entire file
```

---

## ⚠️ Important Notes

### Data Types
- **Academic scripts use**: `INTEGER` for IDs
- **Real database uses**: `UUID` for IDs

### Before Inserting Data
1. Check existing users in `auth.users` table
2. Replace all placeholder UUIDs with real ones
3. Ensure referenced records exist (foreign keys)

### Execution Order
1. ✅ Functions (02-funcoes-ENGLISH.sql)
2. ✅ Triggers (03-triggers-ENGLISH.sql) - depends on functions
3. ✅ Views & Procedures (04-procedures-joins-ENGLISH.sql)
4. ✅ Data Insertion (05-insercao-dados-ENGLISH.sql) - last!

---

## 📊 Verification Queries

After inserting data, verify everything worked:

```sql
-- Count records in each table
SELECT 'user_roles' AS table_name, COUNT(*) FROM user_roles
UNION ALL SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL SELECT 'company_profiles', COUNT(*) FROM company_profiles
UNION ALL SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL SELECT 'applications', COUNT(*) FROM applications
UNION ALL SELECT 'ratings', COUNT(*) FROM ratings
UNION ALL SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL SELECT 'testimonials', COUNT(*) FROM testimonials;

-- Test the view
SELECT * FROM view_complete_applications LIMIT 5;

-- Test the procedures
SELECT * FROM find_qualified_candidates(
    (SELECT id FROM jobs LIMIT 1)
);
```

---

## 🎯 Academic Requirements Met

✅ **Functions**: 2 functions created (`update_candidate_rating`, `update_company_rating`)

✅ **Triggers**: 2 triggers created (on INSERT for `ratings` and `applications`)

✅ **Procedures/Views with JOIN**: 1 view + 3 procedures (all using JOINs)

✅ **Data Insertion**: At least 5 records in each table

---

## 🆘 Troubleshooting

### Error: "relation does not exist"
➡️ You're using Portuguese table names. Use the ENGLISH scripts!

### Error: "foreign key violation"
➡️ Referenced record doesn't exist. Insert parent records first.

### Error: "duplicate key value"
➡️ Record with that ID already exists. Use different UUIDs.

### Error: "function does not exist"
➡️ Create functions first (02-funcoes-ENGLISH.sql)

---

## 📝 License & Author

**Project**: LINKAR - Job Matching Platform
**Database**: PostgreSQL (Supabase)
**Author**: [Your Name]
**Course**: Database

---

**Need help?** Check the comments in each SQL file for detailed explanations! 🚀
