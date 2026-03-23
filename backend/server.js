const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const authRoutes = require('./routes/authRoutes');
const availabilityRoutes = require("./routes/availabilityRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes (CLEAN STRUCTURE)
app.use('/api/users', userRoutes);         // register, login, doctors
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/doctors/availability", require("./routes/availabilityRoutes"));
// ✅ Test Routes
app.get("/", (req, res) => {
  res.send("MEDISLOT backend is running 🚀");
});

app.get("/test", (req, res) => {
  res.json({ message: "Backend connection successful ✅" });
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.log('MongoDB connection error ❌:', err));

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});