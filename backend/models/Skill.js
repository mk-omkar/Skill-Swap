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

  skillsWanted: [String],

  level: {
    type: String,
    default: "Beginner",
  },

  durationType: {
    type: String,
    default: "7 Days",
  },

  customDays: {
    type: Number,
    default: null,
  },

  startTime: {
    type: String,
    default: "",
  },

  endTime: {
    type: String,
    default: "",
  },

  availableSlots: [String],

  rating: {
    type: Number,
    default: 0,
  },

  totalBookings: {
    type: Number,
    default: 0,
  },
  
  isBooked: {
  type: Boolean,
  default: false,
},

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Skill", SkillSchema);