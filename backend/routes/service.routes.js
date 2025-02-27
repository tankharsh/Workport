const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/services.controller");
const upload = require("../multer/multer");

// Route to add a service
// router.post("/add", serviceController.addService);
router.post("/add-service", upload.single("services_img"), serviceController.addService);
router.get("/", serviceController.getAllServices);
// New route for latest 8 services
router.get("/latest-services", serviceController.getRecentServices);
router.get("/service-providers", serviceController.getAllServiceProvidersWithServices);
router.get("/:id", serviceController.getServiceById);
router.put("/update/:id", upload.single("services_img"),serviceController.updateService);
router.delete("/delete/:id", serviceController.deleteService);



module.exports = router;
