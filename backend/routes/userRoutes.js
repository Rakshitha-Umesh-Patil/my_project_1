const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');
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


// ================= ADD DOCTOR (ADMIN) =================
router.post('/add-doctor', authMiddleware(['admin']), async (req, res) => {
  try {
    const { name, email, password, phone, specialization, experience, hospital } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new User({
      name,
      email,
      password: hashedPassword,
      role: "doctor",   // ✅ IMPORTANT
      phone,
      specialization,
      experience,
      hospital
    });

    await doctor.save();

    res.json({ message: "Doctor added successfully", doctor });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET DOCTORS =================
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" })
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

    const doctor = await User.findById(req.user.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!doctor.availability) doctor.availability = [];

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
    const doctor = await User.findById(req.params.doctorId)
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