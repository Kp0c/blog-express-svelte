const User = require('../models/user');
const {validationResult} = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: errors.array().map(error => error.msg).join(', '),
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '1h'
      },
    );

    res.status(201).json({
      message: 'User created successfully',
      token
    });
  } catch (err) {
    next(err);
  }
}

exports.postLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});

    if (!user) {
      return res.status(401).json({
        message: 'Email or password is incorrect',
      });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email or password is incorrect',
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '1h'
      },
    );

    res.status(200).json({
      message: 'User logged in successfully',
      token
    });
  } catch (err) {
    next(err);
  }
}
