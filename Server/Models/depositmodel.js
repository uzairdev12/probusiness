const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: false,
    default: "pending",
  },
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  tid: {
    type: String,
    required: true,
  },
  imageurl: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Deposit", depositSchema);
