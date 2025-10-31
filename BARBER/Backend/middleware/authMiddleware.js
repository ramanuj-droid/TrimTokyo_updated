const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Barber = require('../models/Barber');

const authMiddleware = (roles = []) => {
  // roles can be a string or array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    try {
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'No token provided' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // try to get user by id from either collections
      let user = await User.findById(decoded.id).lean();
      if (!user) {
        user = await Barber.findById(decoded.id).lean();
      }
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = user;

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
  };
};

module.exports = authMiddleware;
