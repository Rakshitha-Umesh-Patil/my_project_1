const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const authMiddleware = require('../middleware/authMiddleware'); // 👈 use protect & restrictTo

// Create booking (User)
router.post('/book', authMiddleware(['user']), async (req, res) => {
  const { doctorId, date, slot, type } = req.body;

  try {
    if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    // Check doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Check if slot is already booked
    const existing = await Appointment.findOne({ doctor: doctorId, date, slot });
    if (existing) return res.status(400).json({ message: "Slot already booked" });

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

    // Remove booked slot from doctor's availability
    if (doctor.availability && doctor.availability.length > 0) {
      doctor.availability = doctor.availability.map(day => {
        if (new Date(day.day).toISOString().split('T')[0] === date) {
          day.slots = day.slots.filter(s => s !== slot);
        }
        return day;
      });
      await doctor.save();
    }

    await appointment.populate('doctor', 'name email specialization');

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    console.error("Error in /book:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;