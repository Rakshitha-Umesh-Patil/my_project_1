const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");


// Add Doctor (Admin)
exports.addDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);

    res.status(201).json({
      message: "Doctor added successfully",
      doctor
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get All Doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Doctor View His Appointments
exports.getDoctorAppointments = async (req, res) => {
  try {

    const doctorId = req.user.id;

    const appointments = await Appointment.find({
      doctor: doctorId
    })
      .populate("user", "name email")
      .sort({ date: 1 });

    res.json(appointments);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Doctor Accept / Reject Appointment
exports.updateAppointmentStatus = async (req, res) => {
  try {

    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be accepted or rejected"
      });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    appointment.status = status;

    await appointment.save();

    res.json({
      message: `Appointment ${status} successfully`,
      appointment
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};