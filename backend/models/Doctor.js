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
  phone: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  hospital: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  availability: [
    {
      day: String,
      slots: [String],
      note: String   
    }
  ],
  role: {
    type: String,
    default: "doctor"
  },
  patientsTreated: {
  type: Number,
  default: 0
}
}, { timestamps: true });

module.exports =
  mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);