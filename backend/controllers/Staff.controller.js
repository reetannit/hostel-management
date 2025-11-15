// const Staff = import('../models/staff.model');
const Staff=require('../models/staff.model');

// Controller to add a new staff 
const addStaff=async(req,res)=>{
    try{
        const {name,role,hostelName,phone,email,joinDate,salary,address,status,experience}=req.body;
        const existingStaff=await Staff.findOne({email});
        if(existingStaff){
            return  res.status(400).json({message:"Staff with this email already exists"});
        }   
        const newStaff=await Staff.create({
            name,
            role,
            hostelName,
            phone,
            email,
            joinDate,
            salary,
            address,
            status,
            experience
        });
        await newStaff.save();
        return res.status(201).json({message:"Staff added successfully",staff:newStaff});
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
}

const getStaff=async(req,res)=>{
    try{
        const staffList=await Staff.find();
        return res.status(200).json({staff:staffList});
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});     
    }
}
const updateStaff=async(req,res)=>{
    try{
        const {id}=req.params;
        const updatedData=req.body;
        const updatedStaff=await Staff.findByIdAndUpdate(id,updatedData,{new:true});
        if(!updatedStaff){
            return res.status(404).json({message:"Staff not found"});
        }
        return res.status(200).json({message:"Staff updated successfully",staff:updatedStaff});
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
}
const deleteStaff=async(req,res)=>{
    try{
        const {id}=req.params;
        const deletedStaff=await Staff.findByIdAndDelete(id);
        if(!deletedStaff){
            return res.status(404).json({message:"Staff not found"});
        }
        return res.status(200).json({message:"Staff deleted successfully"});
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
}

module.exports={addStaff,getStaff,updateStaff,deleteStaff};