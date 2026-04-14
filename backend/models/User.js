const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user','doctor','admin'], default: 'user' },
  phone: String,
  specialization: String,
  experience: Number,
  hospital: String,
  patientsTreated: { type: Number, default: 0 },

  // ✅ FINAL CORRECT AVAILABILITY MODEL
  availability: [
    {
      date: { type: String, required: true },   // STRING ONLY
      slots: [{ type: String }]
    }
  ],

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);