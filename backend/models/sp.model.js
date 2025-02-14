const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define Service Provider Schema
const spSchema = new mongoose.Schema({
    sp_name: { type: String, required: true },
    sp_email: { type: String, required: true, unique: true , index: true },
    sp_contact: { type: String, required: true },
    sp_shop_name: { type: String, required: true },
    sp_block_no: { type: String, required: true },
    sp_area: { type: String, required: true },
    sp_pincode: { type: String, required: true },
    sp_city: { type: String, required: true },
    sp_password: { type: String, required: true , select: false},
    sp_shop_img: { type: String },
    sp_shop_banner_img: { type: String },
    sp_category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" , required: true }],
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }] // 🔹 New field to store linked services
  }
, { timestamps: true });


// 🔹 Pre-save Hook: Automatically Hash Password Before Storing
spSchema.pre("save", async function (next) {
    if (this.isModified("sp_password")) {
      const salt = await bcrypt.genSalt(10);
      this.sp_password = await bcrypt.hash(this.sp_password, salt);
    }
    next();
  });


// // Function to generate authentication token
// spSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign(
//         { _id: this._id, sp_email: this.sp_email },
//         process.env.JWT_SECRET, // Ensure this is set
//         { expiresIn: '24h' }
//     );
//     return token;
// };


// 🔹 Method: Generate JWT Token
spSchema.methods.generateAuthToken = function () {
    return jwt.sign(
      { _id: this._id, sp_email: this.sp_email },
      process.env.JWT_SECRET , // 🔹 Fallback for safety
      { expiresIn: "24h" }
    );
  };

// The comparePassword function to validate the password
spSchema.methods.comparePassword = async function (sp_password) {
    return bcrypt.compare(sp_password, this.sp_password);
};

// Static method to hash password (for creating a new provider or updating the password)
spSchema.statics.hashpassword = async function(sp_password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(sp_password, salt);
};

// Create the ServiceProvider model
const ServiceProvider = mongoose.model('ServiceProvider', spSchema);

module.exports = ServiceProvider;
