const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    slot: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['NORMAL', 'EMERGENCY'],
      default: 'NORMAL',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// 🔥 VERY IMPORTANT: Prevent double booking at database level
appointmentSchema.index(
  { doctor: 1, date: 1, slot: 1 },
  { unique: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);