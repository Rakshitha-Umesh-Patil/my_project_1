const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   // ✅ FIXED
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  slot: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['NORMAL', 'EMERGENCY'],
    default: 'NORMAL'
  },
  priority: {
    type: Number,
    default: 3
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'], // ✅ FIXED
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);