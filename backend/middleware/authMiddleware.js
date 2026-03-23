const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Decoded user:", decoded); // ✅ CORRECT PLACE

      req.user = decoded;

      // Role check
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();

    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;