const User = require("../models/user.model");
const { v4: uuidv4 } = require('uuid');

// ✅ Update payment details of a user
const updatePaymentDetails = async (req, res) => {
  try {
    const userId = req.params.id; // user id from URL
    const { totalFee, paidAmount } = req.body;

    if (totalFee == null || paidAmount == null) {
      return res.status(400).json({ message: "Total fee and paid amount are required" });
    }

    // find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // calculate remaining and status
    const remainingAmount = totalFee - paidAmount;
    let paymentStatus = "pending";
    if (paidAmount === 0) paymentStatus = "pending";
    else if (paidAmount < totalFee) paymentStatus = "partial";
    else if (paidAmount >= totalFee) paymentStatus = "complete";

    // generate a unique transaction ID
    // const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digits
    // const date = new Date().toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
    // const transactionId = `TXN-${date}-${randomNum}`;
    const transactionId = `TXN-${uuidv4()}`; // using UUID for uniqueness

    // update user record
    user.totalFee = totalFee;
    user.paidAmount = paidAmount;
    user.remainingAmount = remainingAmount;
    user.paymentStatus = paymentStatus;
    user.transactionId = transactionId;

    await user.save();

    res.json({
      success: true,
      message: "Payment details updated successfully",
      transactionId,
      user
    });
  } catch (err) {
    console.log("Error updating payment details:", err);
    res.status(500).json({ message: "Something went wrong while updating payment" });
  }
};

module.exports = { updatePaymentDetails };
