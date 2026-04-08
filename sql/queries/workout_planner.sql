-- ============================================================================
-- WORKOUT PLANNER QUERIES
-- ============================================================================

-- :save
INSERT INTO workout_plans (member_id, goal, level, days_per_week, plan)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, member_id, goal, level, days_per_week, plan, created_at;

-- :getByMemberId
SELECT id, goal, level, days_per_week, plan, created_at
FROM workout_plans
WHERE member_id = $1
ORDER BY created_at DESC;

-- :getById
SELECT id, member_id, goal, level, days_per_week, plan, created_at
FROM workout_plans
WHERE id = $1;

-- :deleteById
DELETE FROM workout_plans WHERE id = $1;
