const express = require("express");
const router = express.Router();

const doctorController = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


// Admin adds doctor
router.post("/add", doctorController.addDoctor);

// Get doctors list
router.get("/", doctorController.getDoctors);

// Doctor view appointments
router.get(
  "/appointments",
  authMiddleware,
  roleMiddleware(["doctor"]),
  doctorController.getDoctorAppointments
);

// Doctor accept/reject appointment
router.put(
  "/appointments/:appointmentId",
  authMiddleware,
  roleMiddleware(["doctor"]),
  doctorController.updateAppointmentStatus
);

module.exports = router;