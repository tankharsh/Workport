const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/services.controller");
const upload = require("../multer/multer");

// Route to add a service
// router.post("/add", serviceController.addService);
router.post("/add-service", upload.single("serviceImage"), serviceController.addService);
router.get("/", serviceController.getAllServices);
// New route for latest 8 services
router.get("/recentlyservices", serviceController.getRecentServices);
router.get("/service-providers", serviceController.getAllServiceProvidersWithServices);
router.get("/:id", serviceController.getServiceById);
router.put("/update/:id", upload.single("serviceImage"), serviceController.updateService);
router.delete("/delete/:id", serviceController.deleteService);

module.exports = router;
