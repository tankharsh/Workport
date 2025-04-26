const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: [3, 'Name must be at least 3 characters'],
    },
    userEmail: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters'],
    },
    userContact: {
        type: String,
        required: true,
        unique: true,
    },
    userAddress: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    // socketId: {
    //     type: String,
    // },
});

// Generate Auth Token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

};

// Compare Password
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Hash Password (Static Method)
userSchema.statics.hashpassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
