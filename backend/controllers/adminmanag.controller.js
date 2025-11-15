const Room = require("../models/room.model");

// Admin creates or updates a room
const createOrUpdateRoom = async (req, res) => {
  const { roomNumber, hostelName, floor, capacity, wardenName, coWardenName } = req.body;

  // Validate required fields
  if (!roomNumber || !hostelName || !floor || !capacity || !wardenName) {
    return res.status(400).json({
      success: false,
      message: "roomNumber, hostelName, floor, capacity, and wardenName are required"
    });
  }

  try {
    // Check if the room already exists
    let room = await Room.findOne({ roomNumber });

    if (room) {
      // Room exists → update details
      room.hostelName = hostelName || room.hostelName;
      room.floor = floor || room.floor;
      room.capacity = capacity || room.capacity;
      room.wardenName = wardenName || room.wardenName;
      room.coWardenName = coWardenName !== undefined ? coWardenName : room.coWardenName;

      // Ensure all new fields exist for old documents
      if (room.status === undefined) room.status = "empty";
      if (room.applicants === undefined) room.applicants = [];
      if (room.assignedTo === undefined) room.assignedTo = [];

      await room.save();
      return res.status(200).json({ success: true, message: "Room updated successfully", room });
    }

    // Room does not exist → create new
    room = new Room({
      roomNumber,
      hostelName,
      floor,
      capacity,
      wardenName,
      coWardenName: coWardenName || null,
      status: "empty",
      applicants: [],
      assignedTo: []
    });

    await room.save();
    res.status(201).json({ success: true, message: "Room created successfully", room });
  } catch (error) {
    // Handle duplicate key error for unique roomNumber
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Room with number ${roomNumber} already exists`
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const showRooms=async(req,res)=>{
  try{
    const rooms=await Room.find();
    res.status(200).json({success:true,rooms});

  }
  catch(error){
    res.status(500).json({success:false,message:error.message});
  }
}

const UpdateRoom = async (req, res) => {
  try {
    const { hostelName, roomNumber } = req.params;
    const data = req.body;

    const room = await Room.findOneAndUpdate(
      { hostelName: hostelName, roomNumber: Number(roomNumber) },
      data,
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try{
    const { roomId } = req.params;
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    res.status(200).json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


module.exports = { createOrUpdateRoom, showRooms, UpdateRoom, deleteRoom };
