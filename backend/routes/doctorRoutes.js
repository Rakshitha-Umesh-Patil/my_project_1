const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// Get all doctors (for patients to book appointments)
router.get("/", auth(["user", "doctor", "admin"]), async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select(
      "name email specialization availability"
    );
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;