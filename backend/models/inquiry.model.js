const mongoose = require("mongoose");

// const InquirySchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
//     serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider", required: true },
//     status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
// }, { timestamps: true });

const InquirySchema = new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
      serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider", required: true },
      status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
      date: { type: String },
      time: { type: String },
      message: { type: String },
      userAddress: { type: String },
      preferredDate: { type: String },
      additionalInfo: { type: String },
    },
    { timestamps: true }
  );

module.exports = mongoose.model("Inquiry", InquirySchema);
