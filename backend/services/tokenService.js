const BlackListToken = require('../models/blackListToken.model');

const blacklistToken = async (token) => {
  try {
    // Check if the token is already blacklisted
    const existingToken = await BlackListToken.findOne({ token });
    if (existingToken) {
      console.log("Token is already blacklisted");
      return { message: "Token is already blacklisted", status: "success" };
    }

    // Add the token to the blacklist
    const newBlacklistToken = new BlackListToken({ token });
    await newBlacklistToken.save();
    console.log("Token successfully blacklisted");
    return { message: "Token successfully blacklisted", status: "success" };

  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key errors explicitly
      console.error("Duplicate token error:", error.message);
      return { message: "Token is already blacklisted", status: "success" };
    }
    console.error("Error blacklisting token:", error.message);
    throw new Error("Error while blacklisting the token");
  }
};

module.exports = { blacklistToken };
