const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

// USER
router.get(
  "/user",
  authMiddleware(['user']),
  (req, res) => {
    res.json({ message: "User route working" });
  }
);

// ADMIN
router.get(
  "/admin",
  authMiddleware(['admin']),
  (req, res) => {
    res.json({ message: "Admin route working" });
  }
);

// DOCTOR
router.get(
  "/doctor",
  authMiddleware(['doctor']),
  (req, res) => {
    res.json({ message: "Doctor route working" });
  }
);

module.exports = router;