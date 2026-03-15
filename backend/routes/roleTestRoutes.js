const express = require("express");
const router = express.Router();

const { protect, restrictTo } = require("../middleware/authMiddleware");

router.get(
  "/user",
  protect,
  restrictTo("user"),
  (req, res) => {
    res.json({ message: "User route working" });
  }
);

router.get(
  "/admin",
  protect,
  restrictTo("admin"),
  (req, res) => {
    res.json({ message: "Admin route working" });
  }
);

router.get(
  "/doctor",
  protect,
  restrictTo("doctor"),
  (req, res) => {
    res.json({ message: "Doctor route working" });
  }
);

module.exports = router;
