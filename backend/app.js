const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors"); // Correct module name
const connectDB = require("./db/db");
const userRoutes = require('./routes/user.routes');
const spRouter = require("./routes/sp.routes");

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended:true}));

// Cookie parser middleware
app.use(cookieParser());



// Routes
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.use('/api/users', userRoutes);
app.use("/api/sp", spRouter);

module.exports = app;
