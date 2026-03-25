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
  availability: [
    {
      date: String,
      slots: [String],
      note: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);