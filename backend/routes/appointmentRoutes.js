const express = require('express');
const router = express.Router();

const Appointment = require('../models/Appointment');
const User = require('../models/User');
const auth = require("../middleware/authMiddleware");


// ===============================
// ✅ BOOK APPOINTMENT (USER)
// ===============================
router.post('/book', auth(['user']), async (req, res) => {
  try {
    const { doctorId, date, slot, type } = req.body;

    if (!doctorId || !date || !slot) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = await Appointment.create({
      user: req.user.id,
      doctor: doctorId,
      date: new Date(date),
      slot,
      type: type || "NORMAL",
      status: "pending"
    });

    res.json({ message: "Booked successfully", appointment });

  } catch (err) {
    // 🔥 Handle unique index error (double booking)
    if (err.code === 11000) {
      return res.status(400).json({ message: "Slot already booked" });
    }
    res.status(500).json({ message: err.message });
  }
});


// ===============================
// ✅ DOCTOR — VIEW APPOINTMENTS
// ===============================
router.get('/doctor-appointments', auth(['doctor']), async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user.id,
      status: { $ne: "cancelled" }
    })
      .populate('user', 'name email phone')
      .sort({ date: 1 });

    res.json(appointments);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ===============================
// ✅ DOCTOR — UPDATE STATUS
// ===============================
router.put('/update-status/:id', auth(['doctor']), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = ['accepted', 'rejected', 'completed'];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user.id,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: "Status updated", appointment });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ===============================
// ✅ USER — CANCEL APPOINTMENT
// ===============================
router.put('/cancel/:id', auth(['user']), async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: "pending"
    });

    if (!appointment) {
      return res.status(404).json({ message: "Only pending appointments can be cancelled" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Cancelled successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ===============================
// ✅ USER — MY APPOINTMENTS
// ===============================
router.get('/my-appointments', auth(['user']), async (req, res) => {
  try {
    const appointments = await Appointment.find({
      user: req.user.id
    })
      .populate('doctor', 'name email specialization hospital')
      .sort({ date: -1 });

    res.json(appointments);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;