const express = require('express');
const router = express.Router();

const Appointment = require('../models/Appointment');
const authMiddleware = require('../middleware/authMiddleware');

// ================= GET ALL APPOINTMENTS =================
router.get('/appointments', authMiddleware(['admin']), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor', 'name email specialization hospital')
      .populate('user', 'name email phone')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;