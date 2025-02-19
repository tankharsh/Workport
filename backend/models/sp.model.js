// Ensure the ServiceProvider model is exported properly
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Define Service Provider Schema
const spSchema = new mongoose.Schema({
    sp_name: { type: String, required: true },
    sp_email: { type: String, required: true, unique: true, index: true },
    sp_contact: { type: String, required: true },
    sp_shop_name: { type: String, required: true },
    sp_block_no: { type: String, required: true },
    sp_area: { type: String, required: true },
    sp_pincode: { type: String, required: true },
    sp_city: { type: String, required: true },
    sp_password: { type: String, required: true, select: false },
    sp_shop_img: { type: String },
    sp_shop_banner_img: { type: String },
    sp_category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }],
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }]
}, { timestamps: true });

// Generate Auth Token
spSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

};

// Compare Password
spSchema.methods.comparePassword = async function(sp_password) {
    return await bcrypt.compare(sp_password, this.sp_password);
};

// Hash Password (Static Method)
spSchema.statics.hashpassword = async function(sp_password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(sp_password, salt);
};

// Create and export the ServiceProvider model
const ServiceProvider = mongoose.model('ServiceProvider', spSchema);
module.exports = ServiceProvider; // Correct export