const express = require("express");
const app = express();

app.use(express.json());   // ✅ MOVE THIS TO TOP
const appointmentRoutes = require("./routes/appointmentRoutes");

const doctorRoutes = require("./routes/doctorRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const authRoutes = require("./routes/authRoutes");
const roleTestRoutes = require("./routes/roleTestRoutes");

app.use("/api/appointments", appointmentRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/test", roleTestRoutes);

module.exports = app;
