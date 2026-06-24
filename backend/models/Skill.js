const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  tutorName: {
    type: String,
    required: true,
  },

  tutorProfilePicture: {
    type: String,
    default: "",
  },

  duration: {
    type: Number,
    default: 60,
  },

  sessionsAvailable: {
    type: Number,
    default: 5,
  },

  rating: {
    type: Number,
    default: 0,
  },

  totalBookings: {
    type: Number,
    default: 0,
  },

  availableSlots: [
    {
      type: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Skill", SkillSchema);
