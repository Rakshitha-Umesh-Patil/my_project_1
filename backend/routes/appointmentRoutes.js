const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Appointment = require('../models/Appointment');
const User = require('../models/User'); // ✅ single source of truth
const authMiddleware = require('../middleware/authMiddleware');


// ===============================
// Create booking (User)
router.post('/book', authMiddleware(['user']), async (req, res) => {
  const { doctorId, date, slot, type } = req.body;

  try {
    const doctor = await User.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 🔥 CHECK SLOT EXISTS IN AVAILABILITY
    const day = doctor.availability.find(d => d.date === date);

    if (!day || !day.slots.includes(slot)) {
      return res.status(400).json({ message: "Slot not available" });
    }

    // 🔥 DOUBLE BOOKING CHECK
    const existing = await Appointment.findOne({
      doctor: doctorId,
      date,
      slot
    });

    if (existing) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const appointment = new Appointment({
      user: req.user.id,
      doctor: doctorId,
      date,
      slot,
      type,
      status: "pending"
    });

    await appointment.save();

    // 🔥 REMOVE SLOT AFTER BOOKING
    day.slots = day.slots.filter(s => s !== slot);

    await doctor.save();

    res.json({ message: "Booked successfully", appointment });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ===============================
// Get appointments for doctor
router.get('/doctor-appointments', authMiddleware(['doctor']), async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id,
      status: { $ne: "cancelled" } // ✅ hide cancelled
    })
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
// Cancel appointment (user)
router.put('/cancel/:id', authMiddleware(['user']), async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({ message: "Already cancelled" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ===============================
// Get user's appointments
router.get('/my-appointments', authMiddleware(['user']), async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate('doctor', 'name email')
      .sort({ date: -1 });

    res.json(appointments);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;