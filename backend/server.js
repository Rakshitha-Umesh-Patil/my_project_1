const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/doctors', doctorRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));


// Routes
app.use('/auth', authRoutes);

app.get("/", (req, res) => {
  res.send("MEDISLOT backend is running");
});
app.get("/test", (req, res) => {
  res.json({ message: "Backend connection successful" })
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
