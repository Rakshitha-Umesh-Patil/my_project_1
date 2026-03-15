const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

/* ===============================
   BOOK APPOINTMENT
=================================*/
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, type, emergencyReason } = req.body;

    // 1️⃣ Check doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // 2️⃣ Prevent double booking
    const existing = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: "BOOKED"
    });

    if (existing) {
      return res.status(400).json({ error: "Slot already booked" });
    }

    // 3️⃣ Emergency priority logic
    let priority = 3; // default NORMAL
    if (type === "EMERGENCY") {
      if (!emergencyReason) {
        return res.status(400).json({ error: "Emergency reason required" });
      }
      priority = 1;
    }

    // 4️⃣ Create appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      type,
      emergencyReason,
      priority
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user._id
    })
      .populate("doctor", "name specialization")
      .sort({ date: 1 });

    const today = new Date();

    const formatted = appointments.map(app => ({
      ...app._doc,
      isUpcoming: new Date(app.date) >= today
    }));

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id
    })
      .populate("patient", "name email")
      .sort({ date: 1 });

    const today = new Date();

    const formatted = appointments.map(app => ({
      ...app._doc,
      isUpcoming: new Date(app.date) >= today
    }));

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
