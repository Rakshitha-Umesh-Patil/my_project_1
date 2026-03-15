const Availability = require("../models/availability");

exports.addAvailability = async (req, res) => {
  try {
    const { date, slots } = req.body;

    const availability = await Availability.create({
      doctor: req.user._id,
      date,
      slots
    });

    res.status(201).json({
      message: "Availability added",
      availability
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
