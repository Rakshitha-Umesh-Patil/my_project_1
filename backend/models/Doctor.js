const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number
  },
  availability: [
    {
      day: String,          // Monday, Tuesday
      slots: [String]       // "10:00-10:30"
    }
  ],
  role: {
    type: String,
    default: "doctor"
  }
}, { timestamps: true });

module.exports =
  mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
