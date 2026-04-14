exports.bookAppointment = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ error: "Only users can book" });
    }

    const { doctorId, date, timeSlot, type } = req.body;

    const existing = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: "BOOKED",
    });

    if (existing) {
      return res.status(400).json({ error: "Slot already booked" });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,   // ✅ FIXED
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      type,
    });

    res.status(201).json({ message: "Booked", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};