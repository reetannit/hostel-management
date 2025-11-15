const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  // Room identity
  roomNumber: { type: String, required: true, unique: true },
  hostelName: { type: String, required: true },
  floor: { type: Number, required: true },
  capacity: { type: Number, required: true }, // number of people this room can accommodate

  // Room application/assignment
applicants: [
    {
      _id:false,
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      email: String
    } // users who requested this room (emails or IDs)
  ],
  assignedTo: [{ type: String, default: [] }], // users who were assigned after warden approval

  // Room status
  status: { type: String, enum: ["empty", "applied", "assigned","partially filled","full"], default: "empty" },

  // Warden info
  wardenName: { type: String, required: true },
  coWardenName: { type: String }, // optional
});

module.exports = mongoose.model("Room", roomSchema);
