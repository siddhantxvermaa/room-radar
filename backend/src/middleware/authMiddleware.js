const jwt = require('jsonwebtoken');
const { getModels } = require('../models/modelProvider');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'room_radar_super_secret_jwt_key_2026');
      const { User } = getModels();
      req.user = await User.findById(decoded.id);
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'cr')) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Requires Admin or CR role' });
};

module.exports = { protect, adminOnly };
