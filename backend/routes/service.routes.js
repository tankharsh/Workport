const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/services.controller");

// Route to add a service
router.post("/add", serviceController.addService);

module.exports = router;
