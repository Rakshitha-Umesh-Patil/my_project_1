const express = require("express");
const router = express.Router();

const { addAvailability } = require("../controllers/availabilityController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  restrictTo("doctor"),
  addAvailability
);

module.exports = router;
