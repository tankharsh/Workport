const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  contactNo: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit contact number'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  address: {
    houseNo: {
      type: String,
      required: true,
      trim: true,
    },
    roadName: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode'],
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;