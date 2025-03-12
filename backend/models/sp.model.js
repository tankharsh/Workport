// Ensure the ServiceProvider model is exported properly
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Define Service Provider Schema
const spSchema = new mongoose.Schema({
    spName: { type: String, required: true },
    spEmail: { type: String, required: true, unique: true, index: true },
    spContact: { type: String, required: true },
    spShopName: { type: String, required: true },
    spBlockNo: { type: String, required: true },
    spArea: { type: String, required: true },
    spPincode: { type: String, required: true },
    spCity: { type: String, required: true },
    spDescription: { type: String, required: true, default: "No description provided" },
    spPassword: { type: String, required: true, select: false },
    spShopImage: { type: String },
    spShopBannerImage: { type: String },
    spCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }],
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Generate Auth Token
spSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Compare Password
spSchema.methods.comparePassword = async function(spPassword) {
    return await bcrypt.compare(spPassword, this.spPassword);
};

// Hash Password (Static Method)
spSchema.statics.hashpassword = async function(spPassword) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(spPassword, salt);
};

// Create and export the ServiceProvider model
const ServiceProvider = mongoose.model('ServiceProvider', spSchema);
module.exports = ServiceProvider; // Correct export