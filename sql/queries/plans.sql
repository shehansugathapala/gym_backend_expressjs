-- ============================================================================
-- PLAN QUERIES
-- ============================================================================

-- :getAll
SELECT * FROM plans ORDER BY id DESC;

-- :getById
SELECT * FROM plans WHERE id = $1;

-- :checkExists
SELECT id FROM plans WHERE id = $1;

-- :insert
INSERT INTO plans (name, description, price, duration_days)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- :update
UPDATE plans SET
  name          = COALESCE($1, name),
  description   = COALESCE($2, description),
  price         = COALESCE($3, price),
  duration_days = COALESCE($4, duration_days),
  is_active     = COALESCE($5, is_active)
WHERE id = $6
RETURNING *;

-- :delete
DELETE FROM plans WHERE id = $1;
