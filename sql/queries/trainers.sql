-- ============================================================================
-- TRAINER QUERIES
-- ============================================================================

-- :getAll
SELECT
  t.id,
  u.full_name,
  u.email,
  u.status,
  t.specialization,
  t.bio,
  t.hire_date
FROM trainers t
JOIN users u ON u.id = t.user_id
ORDER BY t.id DESC;

-- :getById
SELECT
  t.*,
  u.full_name,
  u.email,
  u.role,
  u.status
FROM trainers t
JOIN users u ON u.id = t.user_id
WHERE t.id = $1;

-- :checkExists
SELECT id, user_id FROM trainers WHERE id = $1;

-- :updateProfile
UPDATE trainers SET
  specialization = COALESCE($1, specialization),
  bio            = COALESCE($2, bio),
  hire_date      = COALESCE($3, hire_date)
WHERE id = $4
RETURNING *;

-- :deleteByUserId
DELETE FROM users WHERE id = $1;
