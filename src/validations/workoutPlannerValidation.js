const { body } = require('express-validator');

exports.generatePlanValidation = [
  body('goal')
    .notEmpty().withMessage('Goal is required')
    .isIn(['lose_weight', 'build_muscle', 'stay_fit', 'endurance'])
    .withMessage('Goal must be one of: lose_weight, build_muscle, stay_fit, endurance'),

  body('level')
    .notEmpty().withMessage('Level is required')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be one of: beginner, intermediate, advanced'),

  body('days_per_week')
    .notEmpty().withMessage('days_per_week is required')
    .isInt({ min: 2, max: 6 })
    .withMessage('days_per_week must be between 2 and 6'),
];
