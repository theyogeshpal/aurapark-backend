const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Access token required' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin')
      return res.status(403).json({ success: false, message: 'Admin access required' });
    next();
  });
};

const verifySuperAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'superadmin')
      return res.status(403).json({ success: false, message: 'Super Admin access required' });
    next();
  });
};

module.exports = { verifyToken, verifyAdmin, verifySuperAdmin };
