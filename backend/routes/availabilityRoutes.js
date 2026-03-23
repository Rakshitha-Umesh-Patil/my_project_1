const express = require("express");
const router = express.Router();
const { addAvailability } = require("../controllers/availabilityController");
const authMiddleware = require("../middleware/authMiddleware");

// Only doctor can set availability
router.post(
  "/",
  authMiddleware(['user']),
  addAvailability
);

module.exports = router;