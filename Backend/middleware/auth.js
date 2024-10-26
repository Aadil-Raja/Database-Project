
const jwt = require('jsonwebtoken');

const verifyTokenAndRole = (requiredRole) => (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized! Token is invalid or expired.' });
    }

    if (decoded.role !== requiredRole) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }

    // Token is valid and role matches
    req.user = decoded;
    next();
  });
};

module.exports = verifyTokenAndRole;
