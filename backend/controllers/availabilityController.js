const Doctor = require("../models/Doctor");

exports.addAvailability = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { date, slots = [], note = "" } = req.body;

    if (!date) return res.status(400).json({ message: "Date is required" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const existingDay = doctor.availability.find(d => new Date(d.day).toISOString().split('T')[0] === date);

    if (existingDay) {
      existingDay.slots = slots;
      existingDay.note = note;
    } else {
      doctor.availability.push({ day: date, slots, note });
    }

    await doctor.save();
    res.json({ message: "Availability set successfully ✅", availability: doctor.availability });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};