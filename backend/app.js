const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors"); // Correct module name
const connectDB = require("./db/db");
const userRoutes = require('./routes/user.routes');
const spRouter = require("./routes/sp.routes");
const categoryRoutes = require("./routes/category.routes");
const path = require("path");
const bodyParser = require("body-parser");
const otpRoutes = require('./routes/otpRoutes');
const serviceRoutes = require('./routes/service.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const verificationRoutes = require('./routes/verification.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const contactRoutes = require('./routes/contact.routes');


connectDB();

// Configure CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Add your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use("/uploads", express.static("uploads"));
// Cookie parser middleware
app.use(cookieParser());

// Use JSON parsing middleware for non-file routes
app.use(bodyParser.json());

// Use URL-encoded middleware for non-file routes
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.use('/api/users', userRoutes);
app.use("/api/sp", spRouter);
app.use('/api/otp', otpRoutes);
app.use('/api/services',serviceRoutes);
app.use('/api/inquiries',inquiryRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/contact', contactRoutes);

// Static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", categoryRoutes);

module.exports = app;
