const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Appointment = require('../models/Appointment');
const authMiddleware = require('../middleware/authMiddleware');


// ================= ADD DOCTOR (ADMIN) =================
router.post('/add-doctor', authMiddleware(['admin']), async (req, res) => {
  try {
    const { name, email, password, phone, specialization, experience, hospital, patientsTreated } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Doctor already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new User({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      phone,
      specialization,
      experience,
      hospital,
      patientsTreated: patientsTreated || 0
    });

    await doctor.save();
    res.json({ message: "Doctor added successfully", doctor });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= GET DOCTORS (PUBLIC) =================
router.get('/doctors', async (req, res) => {
  try {
    const { search = "" } = req.query;

    const doctors = await User.find({
      role: "doctor",
      $or: [
        { hospital: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } }
      ]
    }).select("-password");

    res.json({ doctors });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= GET DOCTOR BY ID (PUBLIC) =================
router.get('/doctor/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= EDIT DOCTOR (ADMIN) =================
router.put('/edit-doctor/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    const { name, email, phone, specialization, experience, hospital, patientsTreated } = req.body;

    const doctor = await User.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.name = name ?? doctor.name;
    doctor.email = email ?? doctor.email;
    doctor.phone = phone ?? doctor.phone;
    doctor.specialization = specialization ?? doctor.specialization;
    doctor.experience = experience ?? doctor.experience;
    doctor.hospital = hospital ?? doctor.hospital;
    doctor.patientsTreated = patientsTreated ?? doctor.patientsTreated;

    await doctor.save();

    res.json({ message: "Doctor updated successfully", doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= DELETE DOCTOR (ADMIN) =================
router.delete('/delete-doctor/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= GET ALL APPOINTMENTS (ADMIN) =================
router.get('/appointments', authMiddleware(['admin']), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor', 'name email')
      .populate('user', 'name email')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;