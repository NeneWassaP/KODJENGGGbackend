const mongoose = require("mongoose");
const uuid = require('node-uuid');

const ReservationSchema = new mongoose.Schema({
  sessionId:{
    type: String,
  },
  revDate: {
    type: Date,
    require: true,
  },
  nightNum: {
    type: Number,
    default: 1
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: "Hotel",
    required: true,
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: "Room",
    required: true,
  },
  totalPrice: {
    type: Number,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["unpaid", "pending", "disapproved", "reserved", "completed", "reviewed" ],
    default: "unpaid",
  }
});

module.exports = mongoose.model("Reservation", ReservationSchema);