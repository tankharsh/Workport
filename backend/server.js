const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require('./db/db');
dotenv.config(); // Load environment variables

const app = express();

connectDB();
// Middleware
app.use(express.json());

// Default route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`);
});


