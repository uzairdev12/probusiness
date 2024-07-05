// create a user model

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: "User",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: false,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    required: false,
    default: false,
  },
  deposited: {
    type: Number,
    required: false,
    default: 0,
  },
  reward: {
    type: Number,
    required: false,
    default: 0,
  },
  refferOf: {
    type: String,
    required: false,
  },
  total: {
    type: Number,
    required: false,
    default: 0,
  },
  accName: {
    type: String,
    required: false,
  },
  totalPairs: {
    type: Number,
    required: false,
    default: 0,
  },
  leftuser: {
    type: String,
    required: false,
    default: null,
  },

  rightuser: {
    type: String,
    required: false,
    default: null,
  },
  leftusers: {
    type: Number,
    required: false,
    default: 0,
  },

  rightusers: {
    type: Number,
    required: false,
    default: 0,
  },
  leftie: {
    type: Boolean,
    required: false,
    default: false,
  },
  rightie: {
    type: Boolean,
    required: false,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
