-- ============================================================================
-- MEMBER QUERIES
-- ============================================================================

-- :getAll
SELECT
  m.id,
  u.full_name,
  u.email,
  u.status,
  m.phone,
  m.gender,
  m.date_of_birth,
  m.address,
  m.emergency_contact,
  m.profile_image_url,
  m.joined_date
FROM members m
JOIN users u ON u.id = m.user_id
ORDER BY m.id DESC;

-- :getById
SELECT
  m.*,
  u.full_name,
  u.email,
  u.role,
  u.status
FROM members m
JOIN users u ON u.id = m.user_id
WHERE m.id = $1;

-- :checkExists
SELECT id, user_id FROM members WHERE id = $1;

-- :updateProfile
UPDATE members SET
  phone             = COALESCE($1, phone),
  gender            = COALESCE($2, gender),
  date_of_birth     = COALESCE($3, date_of_birth),
  address           = COALESCE($4, address),
  emergency_contact = COALESCE($5, emergency_contact),
  profile_image_url = COALESCE($6, profile_image_url)
WHERE id = $7
RETURNING *;

-- :deleteByUserId
DELETE FROM users WHERE id = $1;

-- :getByUserId
SELECT
  m.*,
  u.full_name,
  u.email,
  u.role,
  u.status
FROM members m
JOIN users u ON u.id = m.user_id
WHERE m.user_id = $1;
