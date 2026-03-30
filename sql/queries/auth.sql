-- ============================================================================
-- AUTH QUERIES
-- ============================================================================

-- :findByEmail
SELECT id, full_name, email, password_hash, role, status
FROM users
WHERE email = $1;

-- :findIdByEmail
SELECT id FROM users WHERE email = $1;

-- :insertUser
INSERT INTO users (full_name, email, password_hash, role)
VALUES ($1, $2, $3, $4)
RETURNING id, full_name, email, role, status, created_at;

-- :insertMember
INSERT INTO members (user_id) VALUES ($1);

-- :insertTrainer
INSERT INTO trainers (user_id) VALUES ($1);
