const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');


// ===============================
// Create booking (User)
// ===============================
router.post('/book', authMiddleware(['user']), async (req, res) => {

    const { doctorId, date, slot, type } = req.body;

    try {

        // Check if slot already booked
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
            priority: type === "EMERGENCY" ? 1 : 3
        });

        await appointment.save();

        // Remove slot from doctor availability
        const doctor = await User.findById(doctorId);

        if (doctor && doctor.availability) {

            doctor.availability = doctor.availability.map(day => {

                if (day.date.toISOString().split('T')[0] === date) {
                    day.slots = day.slots.filter(s => s !== slot);
                }

                return day;

            });

            await doctor.save();
        }

        res.status(201).json({
            message: "Appointment booked successfully",
            appointment
        });

    } catch (err) {

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
        }).populate('doctor', 'name email');

        res.json(appointments);

    } catch (err) {

        res.status(500).json({
            message: "Server error",
            error: err.message
        });

    }
});


// ===============================
// Get DOCTOR appointments
// ===============================
router.get('/doctor-appointments', authMiddleware(['doctor']), async (req, res) => {

    try {

        const appointments = await Appointment.find({
            doctor: req.user.id
        })
        .populate('user', 'name email')
        .sort({ priority: 1, date: 1 });

        res.json(appointments);

    } catch (err) {

        res.status(500).json({
            message: "Server error",
            error: err.message
        });

    }

});


// ===============================
// Doctor Accept / Reject
// ===============================
router.put('/update-status/:id', authMiddleware(['doctor']), async (req, res) => {

    const { status } = req.body;

    try {

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        appointment.status = status;

        await appointment.save();

        res.json({
            message: "Appointment status updated",
            appointment
        });

    } catch (err) {

        res.status(500).json({
            message: "Server error",
            error: err.message
        });

    }

});


// ===============================
// Cancel appointment (User)
// ===============================
router.put('/cancel/:id', authMiddleware(['user']), async (req, res) => {

    try {

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to cancel this appointment"
            });
        }

        appointment.status = "cancelled";

        await appointment.save();

        // Restore slot back to doctor availability
        const doctor = await User.findById(appointment.doctor);

        if (doctor) {

            const dateStr = new Date(appointment.date).toISOString().split('T')[0];

            let day = doctor.availability.find(
                d => new Date(d.date).toISOString().split('T')[0] === dateStr
            );

            if (day) {

                day.slots.push(appointment.slot);

            } else {

                doctor.availability.push({
                    date: dateStr,
                    slots: [appointment.slot]
                });

            }

            await doctor.save();

        }

        res.json({
            message: "Appointment cancelled successfully",
            appointment
        });

    } catch (err) {

        res.status(500).json({
            message: "Server error",
            error: err.message
        });

    }

});


// ===============================
// Admin: Get all appointments
// ===============================
router.get('/all', authMiddleware(['admin']), async (req, res) => {

    try {

        const appointments = await Appointment.find()
        .populate('user', 'name email')
        .populate('doctor', 'name email');

        res.json(appointments);

    } catch (err) {

        res.status(500).json({
            message: "Server error",
            error: err.message
        });

    }

});

module.exports = router;