const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Appointment = require('../models/Appointment');
const User = require('../models/User'); // ✅ FIXED
const authMiddleware = require('../middleware/authMiddleware');


// ===============================
// Create booking (User)
router.post('/book', authMiddleware(['user']), async (req, res) => {
  const { doctorId, date, slot, type } = req.body;

  try {
    // Validate ID
    if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    // ✅ FIND DOCTOR FROM USER COLLECTION
    const doctor = await User.findOne({
      _id: doctorId,
      role: "doctor"
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check slot
    const existing = await Appointment.findOne({
      doctor: doctorId,
      date,
      slot
    });

    if (existing) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // Create appointment
    const appointment = new Appointment({
      user: req.user.id,
      doctor: doctorId,
      date,
      slot,
      type: type || "NORMAL",
      priority: type === "EMERGENCY" ? 1 : 3,
      status: "pending"
    });

    await appointment.save();

    // Populate doctor info
    await appointment.populate('doctor', 'name email');

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ===============================
// Get appointments for logged-in doctor
router.get('/doctor-appointments', authMiddleware(['doctor']), async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('user', 'name email phone')
      .sort({ date: 1, priority: 1 });

    res.json(appointments);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ===============================
// Update appointment status (doctor)
router.put('/update-status/:id', authMiddleware(['doctor']), async (req, res) => {
  const { status } = req.body;

  const validStatus = ['pending', 'accepted', 'rejected', 'completed'];

  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user.id
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      message: "Status updated successfully",
      appointment
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ===============================
// User's own appointments
router.get('/my-appointments', authMiddleware(['user']), async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate('doctor', 'name email')
      .sort({ date: -1 });

    res.json(appointments);

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;