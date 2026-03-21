const { body } = require('express-validator');

exports.createPlanValidation = [
  body('name').notEmpty().withMessage('Plan name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('duration_days')
    .isInt({ gt: 0 })
    .withMessage('Duration days must be greater than 0'),
];