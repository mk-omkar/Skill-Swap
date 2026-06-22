const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  bio: {
    type: String,
    default: ""
  },

  experience: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    default: "Beginner"
  },

  skillsOffered: [String],

  skillsWanted: [String],

  rating: {
    type: Number,
    default: 0
  },

  totalRatings: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);