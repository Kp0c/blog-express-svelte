const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const authorizationHeader = req.get('Authorization');

    if (!authorizationHeader) {
      return next();
    }

    const token = authorizationHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.userId = decoded.userId;
    next();
  } catch (err) {
    // Invalid user token
    next();
  }
}
