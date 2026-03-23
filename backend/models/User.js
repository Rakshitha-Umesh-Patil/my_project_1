const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "doctor", "admin"],
    default: "user"
  },
  availability: [
    {
      date: String,
      slots: [String]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);