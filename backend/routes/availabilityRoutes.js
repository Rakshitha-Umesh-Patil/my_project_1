const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");


// ===============================
// ✅ DOCTOR SET AVAILABILITY
// ===============================
router.post("/set-availability", auth(["doctor"]), async (req, res) => {
  try {
    let { date, slots } = req.body;

    // ✅ force same format everywhere
    date = new Date(date).toISOString().split("T")[0];

    const doctor = await User.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!doctor.availability) doctor.availability = [];

    const existingDay = doctor.availability.find(
      (d) => d.date === date
    );

    if (existingDay) {
      existingDay.slots = slots;
    } else {
      doctor.availability.push({
        date: date,   // ✅ STRING (matches model)
        slots
      });
    }

    await doctor.save();

    res.json({ message: "Availability saved successfully" });

  } catch (err) {
    console.error("Availability Error:", err);
    res.status(500).json({ message: err.message });
  }
});


// ===============================
// ✅ PATIENT GET SLOTS
// ===============================
router.get("/:doctorId/:date", async (req, res) => {
  try {
    let { doctorId, date } = req.params;

    // ✅ same format
    date = new Date(date).toISOString().split("T")[0];

    const doctor = await User.findById(doctorId);
    if (!doctor || !doctor.availability) {
      return res.json({ slots: [] });
    }

    const day = doctor.availability.find(
      (d) => d.date === date
    );

    res.json({ slots: day ? day.slots : [] });

  } catch (err) {
    res.json({ slots: [] });
  }
});

module.exports = router;