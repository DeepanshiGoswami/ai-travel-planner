const { body } = require('express-validator');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Valid email required')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

const tripValidation = [
  body('destination')
    .trim()
    .notEmpty().withMessage('Destination required'),
  body('days')
    .isInt({ min: 1, max: 30 }).withMessage('Days must be 1-30'),
  body('budget')
    .isIn(['Low', 'Medium', 'High']).withMessage('Invalid budget'),
  body('interests')
    .isArray({ min: 1 }).withMessage('Select at least one interest')
];

module.exports = {
  registerValidation,
  loginValidation,
  tripValidation
};
