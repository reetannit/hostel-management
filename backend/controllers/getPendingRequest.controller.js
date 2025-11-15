const Room = require("../models/room.model");
const User = require("../models/user.model");


// ✅ Get all pending room requests (where applicants exist)
const getPendingRequests = async (req, res) => {
  try {
    // Find all rooms that have applicants
    const roomsWithRequests = await Room.find({ applicants: { $exists: true, $ne: [] } })
      .populate('applicants.userId', 'name email roomStatus appliedRoom createdAt course phone year paymentStatus transactionId paidAmount'); // populate userId

    if (roomsWithRequests.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No pending requests found",
        rooms: [],
      });
    }

    // Map room info with applicant details
    const data = roomsWithRequests.map((room) => ({
      roomNumber: room.roomNumber,
      hostelName: room.hostelName,
      floor: room.floor,
      capacity: room.capacity,
      wardenName: room.wardenName,
      applicants: room.applicants.map(app => ({
        userId: app.userId?._id,
        name: app.userId?.name,
        email: app.userId?.email,
        roomStatus: app.userId?.roomStatus,
        appliedRoom: app.userId?.appliedRoom,
        createdAt: app.userId?.createdAt,
        course: app.userId?.course,
        phone: app.userId?.phone,
        year: app.userId?.year,
        paymentStatus: app.userId?.paymentStatus,
        transactionId: app.userId?.transactionId,
        paidAmount: app.userId?.paidAmount,

      }))
    }));

    res.status(200).json({
      success: true,
      message: "Pending room requests fetched successfully",
      rooms: data,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending requests",
      error: error.message,
    });
  }
}
  // ✅ Accept or reject user for a room by room number
  const approveOrRejectByRoomNumber = async (req, res) => {
    const { userId, roomNumber, action } = req.body;

    if (!userId || !roomNumber || !action) {
      return res.status(400).json({
        success: false,
        message: "userId, roomNumber, and action are required",
      });
    }

    try {
      const room = await Room.findOne({ roomNumber });
      const user = await User.findById(userId);

      if (!room) return res.status(404).json({ success: false, message: "Room not found" });
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      if (action === "accept") {
        if (room.assignedTo.length >= room.capacity) {
          return res.status(400).json({ success: false, message: "Room is full" });
        }

        user.roomStatus = "assigned";
        user.roomAssigned = room.roomNumber;
        await user.save();

        room.assignedTo.push(userId);

        room.applicants = room.applicants.filter(
          (applicant) => applicant.userId.toString() !== userId.toString()
        );

        if (room.assignedTo.length === room.capacity) {
          room.status = "full";
        } else {
          room.status = "partially filled";
        }

        await room.save();

        return res.status(200).json({
          success: true,
          message: `User accepted and assigned to room ${roomNumber}`,
          room,
        });
      }

      if (action === "reject") {
        user.roomStatus = "reject";
        await user.save();

        room.applicants = room.applicants.filter((id) => id.toString() !== userId);
        await room.save();

        return res.status(200).json({
          success: true,
          message: `User rejected for room ${roomNumber}`,
          room,
        });
      }

      res.status(400).json({ success: false, message: "Invalid action" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  module.exports = { getPendingRequests, approveOrRejectByRoomNumber };

