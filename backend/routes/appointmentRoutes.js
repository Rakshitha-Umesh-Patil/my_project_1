const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const authMiddleware = require('../middleware/authMiddleware');

// ===============================
// Create booking (User)
// ===============================
router.post('/book', authMiddleware(['user']), async (req, res) => {

  const { doctorId, date, slot, type } = req.body;

  try {

    // ✅ Validate doctor ID
    if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    // ✅ Check doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // ✅ Check slot already booked
    const existing = await Appointment.findOne({
      doctor: doctorId,
      date,
      slot
    });

    if (existing) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // ✅ Create appointment
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

    // ✅ REMOVE SLOT SAFELY (FIXED 🔥)
    if (doctor.availability && doctor.availability.length > 0) {

      doctor.availability = doctor.availability.map(day => {

        const dayDate = new Date(day.date).toISOString().split('T')[0];

        if (dayDate === date) {
          day.slots = day.slots.filter(s => s !== slot);
        }

        return day;

      });

      await doctor.save();
    }

    // ✅ Populate doctor info
    await appointment.populate('doctor', 'name email specialization');

    console.log("Booking success:", appointment); // ✅ debug

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });

  } catch (err) {

    console.error("BOOK ERROR:", err); // ✅ debug

    res.status(500).json({
      message: "Server error",
      error: err.message
    });

  }
});
// ===============================
// Get USER appointments
// ===============================
router.get('/my-appointments', authMiddleware(['user']), async (req, res) => {
  try {

    const appointments = await Appointment.find({
      user: req.user.id
    })
    .populate('doctor', 'name email specialization')
    .sort({ date: -1 });

    res.json(appointments);

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;