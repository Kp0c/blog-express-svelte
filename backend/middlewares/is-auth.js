const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const authorizationHeader = req.get('Authorization');

    if (!authorizationHeader) {
      return res.status(401).json({
        message: 'No token provided'
      });
    }

    const token = authorizationHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Unauthenticated' });
  }
}
