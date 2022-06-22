const express = require('express');
const User = require('../models/user');
const {body} = require("express-validator");
const authController = require('../controllers/auth');

const router = express.Router();

const userValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email is required')
    .custom(async (value, {req}) => {
      const user = await User.findOne({email: value});
      if (user) {
        throw new Error('Email already exists');
      }

      return true;
    }),
  body('password').trim().isLength({ min: 4 }).withMessage('Password should be at least 4 characters long'),
]

router.put('/signup', userValidation, authController.signup);

router.post('/login', authController.postLogin)

module.exports = router;
