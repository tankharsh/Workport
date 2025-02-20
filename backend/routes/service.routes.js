const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/services.controller");

// Route to add a service
router.post("/add", serviceController.addService);
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);
router.put("/update/:id", serviceController.updateService);
router.delete("/delete/:id", serviceController.deleteService);

module.exports = router;
