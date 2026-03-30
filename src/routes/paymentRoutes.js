const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { createPaymentValidation } = require('../validations/paymentValidation');
const {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require('../controllers/paymentController');

const router = express.Router();

// GET /api/payments — admin only
router.get('/', authMiddleware, roleMiddleware('admin'), getPayments);

// GET /api/payments/:id — admin only
router.get('/:id', authMiddleware, roleMiddleware('admin'), getPaymentById);

// POST /api/payments — admin only
router.post('/', authMiddleware, roleMiddleware('admin'), createPaymentValidation, createPayment);

// PUT /api/payments/:id — admin only
router.put('/:id', authMiddleware, roleMiddleware('admin'), updatePayment);

// DELETE /api/payments/:id — admin only
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deletePayment);

module.exports = router;
