const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            console.log("No token received");
            return res.status(401).json({ message: "Unauthorized" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            console.log("Decoded Role:", decoded.role); // 👈 ADD THIS

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden" });
            }

            req.user = decoded;
            next();
        } catch (err) {
            console.log("JWT Error:", err.message);
            return res.status(401).json({ message: "Invalid token" });
        }
    };
};

module.exports = authMiddleware;
