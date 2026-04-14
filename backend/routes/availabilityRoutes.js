const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

// ===============================
// DOCTOR SET AVAILABILITY
// ===============================
router.post("/set-availability", auth(["doctor"]), async (req, res) => {
  try {
    let { date, slots } = req.body;

    // ✅ force YYYY-MM-DD string (VERY IMPORTANT)
    date = new Date(date).toISOString().split("T")[0];

    const doctor = await User.findById(req.user.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    if (!doctor.availability) doctor.availability = [];

    const existingDay = doctor.availability.find(d => d.date === date);

    if (existingDay) {
      existingDay.slots = slots;
    } else {
      doctor.availability.push({ date, slots });
    }

    await doctor.save();

    res.json({ message: "Availability saved successfully" });

  } catch (err) {
    console.error("Availability Error:", err);  // 🔥 you will now see real error if any
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// PATIENT GET SLOTS
// ===============================
router.get("/:doctorId/:date", async (req, res) => {
  try {
    let { doctorId, date } = req.params;

    date = new Date(date).toISOString().split("T")[0];

    const doctor = await User.findById(doctorId);
    if (!doctor || !doctor.availability) {
      return res.json({ slots: [] });
    }

    const day = doctor.availability.find(d => d.date === date);

    res.json({ slots: day ? day.slots : [] });

  } catch (err) {
    console.error(err);
    res.json({ slots: [] });
  }
});

module.exports = router;