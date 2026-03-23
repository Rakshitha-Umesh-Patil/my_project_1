const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");

// Admin adds doctor
router.post("/add", authMiddleware(['admin']), doctorController.addDoctor);

// Get all doctors (anyone can view)
router.get("/", doctorController.getDoctors);

// Update doctor
router.put("/:id", authMiddleware(['admin']), doctorController.updateDoctor);

// Delete doctor
router.delete("/:id", authMiddleware(['admin']), doctorController.deleteDoctor);

// Doctor sets availability
router.post(
  "/availability",
  authMiddleware(['doctor']),
  doctorController.setAvailability
);

// Doctor view appointments
router.get(
  "/appointments",
  authMiddleware(['doctor']),
  doctorController.getDoctorAppointments
);

// Doctor accept/reject appointment
router.put(
  "/appointments/:appointmentId",
  authMiddleware(['doctor']),
  doctorController.updateAppointmentStatus
);

module.exports = router;