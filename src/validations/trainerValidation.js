const { body } = require('express-validator');

exports.updateTrainerValidation = [
  body('specialization')
    .optional()
    .isString()
    .withMessage('Specialization must be a string'),
  body('hire_date')
    .optional()
    .isDate()
    .withMessage('Hire date must be a valid date'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
];
