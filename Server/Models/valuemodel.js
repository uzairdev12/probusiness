// create a user model

const mongoose = require("mongoose");

const valueSchema = new mongoose.Schema({
  joinBonus: {
    type: Number,
    required: false,
    default: 50,
  },
  refferBonus1: {
    type: Number,
    required: false,
    default: 100,
  },
  refferBonus2: {
    type: Number,
    required: false,
    default: 100,
  },
  deposit: {
    type: Boolean,
    required: false,
    default: true,
  },
  withdraw: {
    type: Boolean,
    required: false,
    default: true,
  },
  fees: {
    type: Number,
    required: false,
    default: 10,
  },
  req: {
    type: Number,
    required: false,
    default: 200,
  },
  easypaisaNumber: {
    type: String,
    required: false,
    default: "12345678911",
  },
  easypaisaName: {
    type: String,
    required: false,
    default: "Demo Name",
  },
  jazzcashNumber: {
    type: String,
    required: false,
    default: "12345678911",
  },
  jazzcashName: {
    type: String,
    required: false,
    default: "Demo Name",
  },
});

module.exports = mongoose.model("Value", valueSchema);
