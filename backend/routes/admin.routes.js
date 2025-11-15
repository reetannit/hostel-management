const express=require('express');
const {createOrUpdateRoom, showRooms, UpdateRoom, deleteRoom} = require('../controllers/adminmanag.controller');
const {getPendingRequests}=require('../controllers/getPendingRequest.controller')
const {approveOrRejectByRoomNumber}=require('../controllers/getPendingRequest.controller');
const { addStaff, getStaff, updateStaff ,deleteStaff} = require('../controllers/Staff.controller');

route=express.Router();

route.get('/',(req,res)=>{
    res.send('User Route is working');
});

route.post('/create', createOrUpdateRoom);

route.get('/rooms', showRooms);

route.delete('/rooms/:roomId', deleteRoom);

route.put('/rooms/:hostelName/:roomNumber', UpdateRoom);

route.get('/pending-requests', getPendingRequests);
route.post('/approve-reject', approveOrRejectByRoomNumber);
route.post('/add-staff', addStaff);
route.get('/get-staff', getStaff);
route.put('/update-staff/:id', updateStaff);
route.delete('/delete-staff/:id', deleteStaff);



module.exports=route;