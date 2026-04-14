const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔥 IMPORTANT: fetch user to get role
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; // ✅ now req.user.role exists

      // Role check here itself (no need separate restrictTo if you want)
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = auth;