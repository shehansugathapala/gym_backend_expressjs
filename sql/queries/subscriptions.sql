-- ============================================================================
-- SUBSCRIPTION QUERIES
-- ============================================================================

-- :getAll
SELECT
  s.id,
  s.status,
  s.start_date,
  s.end_date,
  s.created_at,
  m.id       AS member_id,
  u.full_name AS member_name,
  p.id       AS plan_id,
  p.name     AS plan_name,
  p.price    AS plan_price
FROM subscriptions s
JOIN members m ON m.id = s.member_id
JOIN users u   ON u.id = m.user_id
JOIN plans p   ON p.id = s.plan_id
ORDER BY s.id DESC;

-- :getById
SELECT
  s.*,
  u.full_name AS member_name,
  p.name      AS plan_name,
  p.price     AS plan_price
FROM subscriptions s
JOIN members m ON m.id = s.member_id
JOIN users u   ON u.id = m.user_id
JOIN plans p   ON p.id = s.plan_id
WHERE s.id = $1;

-- :checkExists
SELECT id FROM subscriptions WHERE id = $1;

-- :insert
INSERT INTO subscriptions (member_id, plan_id, start_date, end_date, status)
VALUES ($1, $2, $3, $4, COALESCE($5, 'active'))
RETURNING *;

-- :update
UPDATE subscriptions SET
  plan_id    = COALESCE($1, plan_id),
  start_date = COALESCE($2, start_date),
  end_date   = COALESCE($3, end_date),
  status     = COALESCE($4, status)
WHERE id = $5
RETURNING *;

-- :delete
DELETE FROM subscriptions WHERE id = $1;
