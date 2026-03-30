-- ============================================================================
-- ATTENDANCE QUERIES
-- ============================================================================

-- :getAll
SELECT
  a.id,
  a.check_in,
  a.check_out,
  a.notes,
  m.id        AS member_id,
  u.full_name AS member_name
FROM attendance a
JOIN members m ON m.id = a.member_id
JOIN users u   ON u.id = m.user_id
ORDER BY a.check_in DESC;

-- :getByMember
SELECT
  a.id,
  a.check_in,
  a.check_out,
  a.notes,
  u.full_name AS member_name
FROM attendance a
JOIN members m ON m.id = a.member_id
JOIN users u   ON u.id = m.user_id
WHERE a.member_id = $1
ORDER BY a.check_in DESC;

-- :checkOpenSession
SELECT id FROM attendance
WHERE member_id = $1 AND check_out IS NULL;

-- :checkRecordExists
SELECT id, check_out FROM attendance WHERE id = $1;

-- :insert
INSERT INTO attendance (member_id, notes)
VALUES ($1, $2)
RETURNING *;

-- :checkout
UPDATE attendance
SET check_out = NOW()
WHERE id = $1
RETURNING *;
