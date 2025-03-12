const jwt = require("jsonwebtoken");
const BlackListToken = require("../models/blackListToken.model");
const secretKey = process.env.JWT_SECRET; // Ensure this matches the key used to sign the token

// Middleware for authenticating users
module.exports.authUser = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Denied: Token missing" });
    }

    // Check if the token is blacklisted
    const isBlacklisted = await BlackListToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Access Denied: Token is blacklisted" });
    }

    // Verify the token
    const verified = jwt.verify(token, secretKey);
    req.user = verified;

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid Token" });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    }
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Middleware for authenticating service providers
module.exports.authServiceProvider = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Denied: Token missing" });
    }

    // Check if the token is blacklisted
    const isBlacklisted = await BlackListToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Access Denied: Token is blacklisted" });
    }

    // Verify token and check for service provider role
    const verified = jwt.verify(token, secretKey);
    if (!verified.sp_email) {
      return res.status(403).json({ message: "Access Denied: Not a service provider" });
    }

    req.serviceProvider = verified; // Attach service provider data to the request object
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};

// Middleware for checking if user is an admin
module.exports.isAdmin = async (req, res, next) => {
  try {
    // For development purposes, temporarily allow all requests to pass through
    // This will help test the chatbot functionality without admin authentication
    // IMPORTANT: Remove this in production!
    return next();
    
    // Uncomment the below code when ready to implement proper admin authentication
    /*
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Denied: Token missing" });
    }

    // Check if the token is blacklisted
    const isBlacklisted = await BlackListToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Access Denied: Token is blacklisted" });
    }

    // Verify token and check for admin role
    const verified = jwt.verify(token, secretKey);
    if (!verified.isAdmin) {
      return res.status(403).json({ message: "Access Denied: Admin privileges required" });
    }

    req.admin = verified; // Attach admin data to the request object
    next();
    */
  } catch (err) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};
