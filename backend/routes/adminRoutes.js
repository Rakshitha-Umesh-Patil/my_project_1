// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

// ===============================
// ✅ GET ALL DOCTORS
// ===============================
router.get("/doctors", auth(["admin"]), async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (err) {
    console.error("Fetch Doctors Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// ✅ GET ALL APPOINTMENTS
// ===============================
router.get("/appointments", auth(["admin"]), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name email specialization")
      .populate("patient", "name email phone")
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    console.error("Fetch Appointments Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// ✅ DELETE DOCTOR
// ===============================
router.delete("/delete-doctor/:id", auth(["admin"]), async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    await doctor.remove();
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error("Delete Doctor Error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;