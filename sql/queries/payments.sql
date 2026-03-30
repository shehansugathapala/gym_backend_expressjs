-- ============================================================================
-- PAYMENT QUERIES
-- ============================================================================

-- :getAll
SELECT
  p.id,
  p.amount,
  p.payment_date,
  p.payment_method,
  p.status,
  p.notes,
  m.id        AS member_id,
  u.full_name AS member_name,
  s.id        AS subscription_id,
  pl.name     AS plan_name
FROM payments p
JOIN members m      ON m.id  = p.member_id
JOIN users u        ON u.id  = m.user_id
JOIN subscriptions s ON s.id = p.subscription_id
JOIN plans pl       ON pl.id = s.plan_id
ORDER BY p.id DESC;

-- :getById
SELECT
  p.*,
  u.full_name AS member_name,
  pl.name     AS plan_name
FROM payments p
JOIN members m      ON m.id  = p.member_id
JOIN users u        ON u.id  = m.user_id
JOIN subscriptions s ON s.id = p.subscription_id
JOIN plans pl       ON pl.id = s.plan_id
WHERE p.id = $1;

-- :checkExists
SELECT id FROM payments WHERE id = $1;

-- :insert
INSERT INTO payments (member_id, subscription_id, amount, payment_method, status, notes)
VALUES ($1, $2, $3, COALESCE($4, 'cash'), COALESCE($5, 'pending'), $6)
RETURNING *;

-- :update
UPDATE payments SET
  amount         = COALESCE($1, amount),
  payment_method = COALESCE($2, payment_method),
  status         = COALESCE($3, status),
  notes          = COALESCE($4, notes)
WHERE id = $5
RETURNING *;

-- :delete
DELETE FROM payments WHERE id = $1;
