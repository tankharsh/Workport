const mongoose = require("mongoose");

const blackListTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true, // Enforces unique tokens
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // Deletes after 24 hours (TTL)
  },
});

const BlackListToken = mongoose.model("BlackListToken", blackListTokenSchema);

module.exports = BlackListToken;
