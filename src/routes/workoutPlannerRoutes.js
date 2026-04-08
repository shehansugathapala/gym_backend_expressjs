const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { generatePlanValidation } = require('../validations/workoutPlannerValidation');
const {
  generatePlan,
  getPlansByMember,
  getPlanById,
  deletePlan,
} = require('../controllers/workoutPlannerController');

const router = express.Router();

// POST /api/workout-planner/member/:memberId/generate
// Member generates their own plan; admin can generate for any member
router.post(
  '/member/:memberId/generate',
  authMiddleware,
  roleMiddleware('admin', 'member'),
  generatePlanValidation,
  generatePlan,
);

// GET /api/workout-planner/member/:memberId
// Fetch all plans for a member
router.get(
  '/member/:memberId',
  authMiddleware,
  roleMiddleware('admin', 'trainer', 'member'),
  getPlansByMember,
);

// GET /api/workout-planner/:id
// Fetch a single plan by id
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'trainer', 'member'),
  getPlanById,
);

// DELETE /api/workout-planner/:id
// Admin or the member who owns the plan
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin', 'member'),
  deletePlan,
);

module.exports = router;
