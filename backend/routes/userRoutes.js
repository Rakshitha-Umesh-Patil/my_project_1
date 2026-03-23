const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Doctor = require('../models/Doctor'); // 🔥 IMPORTANT
const authMiddleware = require('../middleware/authMiddleware');


// ================= REGISTER =================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ================= GET DOCTORS =================
// ⚠️ Now fetch from DOCTORS collection (not users)
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .select('_id name email specialization experience');

    res.json(doctors);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= SET AVAILABILITY =================
router.post('/set-availability', authMiddleware(['doctor']), async (req, res) => {
  try {
    const { date, slots } = req.body;

    console.log("JWT Data:", req.user);

    // ✅ USE doctorId from JWT
    const doctor = await Doctor.findById(req.user.doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.availability.push({ date, slots });

    await doctor.save();

    res.json({
      message: "Availability added successfully",
      availability: doctor.availability
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= GET AVAILABILITY =================
router.get('/availability/:doctorId', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId)
      .select('name availability');

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;