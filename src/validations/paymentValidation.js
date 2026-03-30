const { body } = require('express-validator');

exports.createPaymentValidation = [
  body('member_id').isInt({ gt: 0 }).withMessage('Valid member_id is required'),
  body('subscription_id').isInt({ gt: 0 }).withMessage('Valid subscription_id is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('payment_method')
    .optional()
    .isIn(['cash', 'card', 'online'])
    .withMessage('Payment method must be cash, card, or online'),
  body('status')
    .optional()
    .isIn(['paid', 'pending', 'failed'])
    .withMessage('Status must be paid, pending, or failed'),
];
