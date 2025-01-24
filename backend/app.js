const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors"); // Correct module name
const connectDB = require("./db/db");
const userRoutes = require('./routes/user.routes');

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true}));

// Routes
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.use('/api/users', userRoutes);

module.exports = app;
