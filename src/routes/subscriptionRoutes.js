const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { createSubscriptionValidation } = require('../validations/subscriptionValidation');
const {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} = require('../controllers/subscriptionController');

const router = express.Router();

// GET /api/subscriptions — admin & trainer
router.get('/', authMiddleware, roleMiddleware('admin', 'trainer'), getSubscriptions);

// GET /api/subscriptions/:id — admin, trainer, member
router.get('/:id', authMiddleware, roleMiddleware('admin', 'trainer', 'member'), getSubscriptionById);

// POST /api/subscriptions — admin only
router.post('/', authMiddleware, roleMiddleware('admin'), createSubscriptionValidation, createSubscription);

// PUT /api/subscriptions/:id — admin only
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateSubscription);

// DELETE /api/subscriptions/:id — admin only
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteSubscription);

module.exports = router;
