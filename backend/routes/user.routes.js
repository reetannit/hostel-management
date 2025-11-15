const express = require("express");
const router = express.Router();
const { updateDetailsAndApplyRoom, getUserData,getAllUsers, queryResponse, queryRise, updateMaintenanceStatus} = require("../controllers/user.controller2");
const {updatePaymentDetails}=require('../controllers/payment.controller');
const {fetchRoomAvailability}=require('../controllers/user.controller2');

router.put("/:id/details-apply", updateDetailsAndApplyRoom);
router.put("/:id/payment", updatePaymentDetails);
router.get("/rooms", fetchRoomAvailability);
router.get("/:id/data", getUserData);
router.get("/all", getAllUsers);

router.put("/query-response/:id",queryResponse);
router.put("/query-rise/:id",queryRise);
router.put("/maintenance-status/:id", updateMaintenanceStatus);

module.exports = router;
