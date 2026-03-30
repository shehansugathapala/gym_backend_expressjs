const { body } = require('express-validator');

exports.updateMemberValidation = [
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('date_of_birth')
    .optional()
    .isDate()
    .withMessage('Date of birth must be a valid date'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
];
