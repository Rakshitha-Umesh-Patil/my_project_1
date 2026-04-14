const Availability = require("../models/Availability");

// ================= SET AVAILABILITY (DOCTOR) =================
const addAvailability = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { date, slots } = req.body;

    if (!date || !slots || slots.length === 0) {
      return res.status(400).json({ message: "Date and slots required" });
    }

    // Convert slots into schema format
    const formattedSlots = slots.map(s => ({
      time: s,
      isBooked: false
    }));

    // Check if date already exists
    let availability = await Availability.findOne({ doctor: doctorId, date });

    if (availability) {
      availability.slots = formattedSlots;
      await availability.save();
    } else {
      await Availability.create({
        doctor: doctorId,
        date,
        slots: formattedSlots
      });
    }

    res.json({ message: "Availability saved successfully ✅" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= GET AVAILABILITY (USER) =================
const getAvailability = async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    const availability = await Availability.findOne({
      doctor: doctorId,
      date
    });

    if (!availability) {
      return res.json([]);
    }

    // Send only free slots
    const freeSlots = availability.slots
      .filter(s => !s.isBooked)
      .map(s => s.time);

    res.json(freeSlots);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addAvailability, getAvailability };