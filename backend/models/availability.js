const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true
    },
    slots: [
      {
        time: String,        // "10:00 AM"
        isBooked: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Availability ||
  mongoose.model("Availability", availabilitySchema);
