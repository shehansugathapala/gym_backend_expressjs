const { body } = require('express-validator');

exports.createSubscriptionValidation = [
  body('member_id').isInt({ gt: 0 }).withMessage('Valid member_id is required'),
  body('plan_id').isInt({ gt: 0 }).withMessage('Valid plan_id is required'),
  body('start_date').isDate().withMessage('start_date must be a valid date'),
  body('end_date')
    .isDate().withMessage('end_date must be a valid date')
    .custom((end_date, { req }) => {
      if (new Date(end_date) <= new Date(req.body.start_date)) {
        throw new Error('end_date must be after start_date');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['active', 'expired', 'cancelled'])
    .withMessage('Status must be active, expired, or cancelled'),
];
