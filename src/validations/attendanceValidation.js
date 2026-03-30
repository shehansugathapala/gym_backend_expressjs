const { body } = require('express-validator');

exports.checkInValidation = [
  body('member_id').isInt({ gt: 0 }).withMessage('Valid member_id is required'),
];
