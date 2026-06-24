const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true,
  },

  offerTitle: {
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

  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  learnerName: {
    type: String,
    required: true,
  },

  offeredSkill: {
    type: String,
    required: true,
  },

  scheduledAt: {
    type: Date,
    required: true,
  },

  notes: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    enum: [
      "requested",
      "accepted",
      "rejected",
      "completed",
    ],
    default: "requested",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Booking",
  BookingSchema
);