const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },

  // Profile Details
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ""
  },
  guardianName: {
    type: String,
    default: ""
  },
  guardianContact: {
    type: String,
    default: ""
  },
  course: {
    type: String,
    default: ""
  },
  year: {
    type: Number,
    default: null
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Male"
  },

  // Payment Details
  totalFee: {
    type: Number,
    default: 0
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  remainingAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "partial", "complete"],
    default: "pending"
  },
  transactionId: {
    type: String,
    // default: null,
    unique: false
  },

  // Room Info
  appliedRoom: {
    type: String,
    default: null
  },
  roomAssigned: {
    type: String,
    default: null
  },
  roomStatus: {
    type: String,
    enum: ["not_applied", "applied", "assigned", "reject"],
    default: "not_applied"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  querySubject:{
    type: String,
    // required: true
  },
  queryType:{
    type: String,
    enum:["Room Related","Payment Related","Maintenance Issue","Food & Mess","Other"],
  },
  queryDescription:{
    type: String,
    // required: true
  },
  queryResponse:{
    type: String,
    default: ""
  },
  queryStatus:{
    type: String,
    enum:["pending", "in-progress", "completed", "rejected"],
    default: "pending"
  },
  assignedTo:{
    type: String,
    default: ""
  }
  
}
, { timestamps: true });

// Export model
module.exports = mongoose.model("User", userSchema);
