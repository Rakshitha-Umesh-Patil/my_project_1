const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Get all doctors
router.get('/doctors', authMiddleware(), async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('_id name email');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});
// Doctor set availability
router.post('/set-availability', authMiddleware(['doctor']), async (req, res) => {
    try {
        const { date, slots } = req.body;

        const doctor = await User.findById(req.user.id);

        doctor.availability.push({ date, slots });

        await doctor.save();

        res.json({
            message: "Availability added successfully",
            availability: doctor.availability
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
// Get doctor availability
router.get('/availability/:doctorId', async (req, res) => {
    try {

        const doctor = await User.findById(req.params.doctorId)
            .select('name availability');

        res.json(doctor);

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;