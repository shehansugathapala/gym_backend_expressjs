const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { createPlanValidation } = require('../validations/planValidation');
const { createPlan, getPlans } = require('../controllers/planController');

const router = express.Router();

router.get('/', authMiddleware, getPlans);
router.post('/', authMiddleware, roleMiddleware('admin'), createPlanValidation, createPlan);

module.exports = router;