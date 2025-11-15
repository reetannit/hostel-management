// import mongoose from 'mongoose';
const mongoose = require("mongoose");


const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['Warden', 'Co-Warden', 'Security Guard', 'Housekeeper', 'Maintenance Staff', 'Mess Manager', 'Accountant'],
    default: 'Warden',
    required: true
  },
  hostelName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  joinDate: {
    type: Date,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'on-leave', 'inactive'],
    default: 'active'
  },
  experience: {
    type: String, // You can convert to Number if you want
    required: false,
    trim: true
  }
}, { timestamps: true });

// export default mongoose.model('Staff', staffSchema);
module.exports=mongoose.model('Staff',staffSchema);
