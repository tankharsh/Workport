const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, useremail, usercontactno, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await userModel.hashpassword(password);

        // Create the user
        const user = await userModel.create({
            username,
            useremail,
            usercontactno,
            password: hashedPassword,
            //socketId,
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, useremail: user.useremail },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                useremail: user.useremail,
                usercontactno: user.usercontactno,
               // socketId: user.socketId,
            },
            token,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        next(error);
    }
};

module.exports.loginUser = async (req, res, next) => {
    // Validate input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { useremail, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await userModel.findOne({ useremail }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, useremail: user.useremail },
            JWT_SECRET,
            { expiresIn: "1h" }
        );
    
        // Send success response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                useremail: user.useremail,
                // socketId: user.socketId,
            },
        });
    } catch (error) {
        next(error); // Pass any errors to the global error handler
    }


};

module.exports.getUserProfile = async (req, res) => {
    try {
      // Check if the middleware attached a valid user to the request object
      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Return the user profile
      res.status(200).json(req.user);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  