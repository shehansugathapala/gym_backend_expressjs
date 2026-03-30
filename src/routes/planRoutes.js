const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { createPlanValidation } = require('../validations/planValidation');
const {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} = require('../controllers/planController');

const router = express.Router();

// GET /api/plans — all authenticated users
router.get('/', authMiddleware, getPlans);

// GET /api/plans/:id
router.get('/:id', authMiddleware, getPlanById);

// POST /api/plans — admin only
router.post('/', authMiddleware, roleMiddleware('admin'), createPlanValidation, createPlan);

// PUT /api/plans/:id — admin only
router.put('/:id', authMiddleware, roleMiddleware('admin'), updatePlan);

// DELETE /api/plans/:id — admin only
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deletePlan);

module.exports = router;