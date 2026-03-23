const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const bcrypt = require("bcryptjs");

// Add doctor (admin)
exports.addDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, specialization, experience, hospital } = req.body;
    if (!name || !email || !password || !phone || !specialization || !experience || !hospital)
      return res.status(400).json({ message: "All fields are required" });

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) return res.status(400).json({ message: "Doctor already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({
      name, email, password: hashedPassword, phone, specialization, experience, hospital, role: "doctor", availability: []
    });

    res.status(201).json({ message: "Doctor added successfully", doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedDoctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor updated successfully", doctor: updatedDoctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Set availability
exports.setAvailability = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { date, slots = [], leaveNote = "" } = req.body;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const existingDay = doctor.availability.find(d => new Date(d.day).toISOString().split("T")[0] === date);
    if (existingDay) {
      existingDay.slots = slots;
      existingDay.leaveNote = leaveNote;
    } else {
      doctor.availability.push({ day: date, slots, leaveNote });
    }

    await doctor.save();
    res.json({ message: "Availability set successfully", availability: doctor.availability });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get doctor appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const appointments = await Appointment.find({ doctor: doctorId }).populate("user", "name email").sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Accept/reject appointment
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) return res.status(400).json({ message: "Status must be accepted or rejected" });

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = status;
    await appointment.save();
    res.json({ message: `Appointment ${status} successfully`, appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};