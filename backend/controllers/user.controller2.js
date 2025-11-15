const User = require("../models/user.model");
const Room = require("../models/room.model");

const updateDetailsAndApplyRoom = async (req, res) => {
    try {
        const userId = req.params.id;
        const {
            address,
            guardianName,
            guardianContact,
            course,
            year,
            gender,
            appliedRoom
        } = req.body;

        // 1️⃣ Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2️⃣ Update personal info
        user.address = address;
        user.guardianName = guardianName;
        user.guardianContact = guardianContact;
        user.course = course;
        user.year = year;
        user.gender = gender;

        // 3️⃣ Update room application info
        if (appliedRoom) {
            user.appliedRoom = appliedRoom;
            user.roomStatus = "applied";

            // 4️⃣ Update Room collection
            const room = await Room.findOne({ roomNumber: appliedRoom });
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }

            // Add student email to applicants if not already there
            // Check if the student is already in applicants
            const alreadyApplied = room.applicants.some(app => app.userId === user._id.toString());

            if (!alreadyApplied) {
                room.applicants.push({
                    userId: user._id.toString(),
                    email: user.email
                });
                await room.save();
            }

        }

        // 5️⃣ Save user
        await user.save();

        res.json({
            success: true,
            message: "User details updated and room applied successfully",
            user
        });

    } catch (err) {
        console.log("Error updating details and applying room:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const fetchRoomAvailability = async (req, res) => {
    try{
        const rooms = await Room.find({});
        res.json({rooms});
    } catch (err) {
        console.log("Error fetching room availability:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

//to get User Data
const getUserData = async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    }
    catch(err){
        console.log("Error fetching user data:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json({ users });
    } catch (err) {
        console.log("Error fetching all users:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const queryRise=async(req,res)=>{
    try{
        const userId=req.params.id;
        const {querySubject,queryType,queryDescription}=req.body;
    
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        user.querySubject=querySubject;
        user.queryType=queryType;
        user.queryDescription=queryDescription;

        await user.save();
        res.json({success:true,message:"Query response sent successfully"});
    } catch (err) {
        console.log("Error sending query response:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
}
const queryResponse=async(req,res)=>{
    try{
        const userId=req.params.id;
        const {queryResponse}=req.body;
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        user.queryResponse=queryResponse;
        await user.save();
        res.json({success:true,message:"Query response sent successfully"});
    } catch (err) {
        console.log("Error sending query response:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

// Update maintenance status
const updateMaintenanceStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { status, assignedTo, response } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update query status
        if (status) {
            user.queryStatus = status;
        }

        // Update assigned staff
        if (assignedTo) {
            user.assignedTo = assignedTo;
        }

        // Update response if provided
        if (response) {
            user.queryResponse = response;
        }

        await user.save();
        res.json({ 
            success: true, 
            message: "Maintenance status updated successfully",
            user 
        });
    } catch (err) {
        console.log("Error updating maintenance status:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = { 
    updateDetailsAndApplyRoom, 
    fetchRoomAvailability,
    getUserData,
    getAllUsers,
    queryResponse,
    queryRise,
    updateMaintenanceStatus 
};
