// const { body } = require("express-validator");
const spController = require("../controllers/sp.controller");
const authmiddleware = require("../middlewares/auth.middleware");
const router = require("express").Router();
// const multer = require("multer");
const upload = require("../multer/multer");
const { validateRegisterSP, validateLoginSP } = require("../validators/sp.validator");


// Register Service Provider
router.post(
    "/sp_register",
    upload.fields([
        { name: "spShopImage", maxCount: 1 },
        { name: "spShopBannerImage", maxCount: 1 },
    ]),
    validateRegisterSP,
    spController.registerSP
);

// Login Service Provider
router.post("/sp_login", validateLoginSP, spController.loginSP);

// Verify service provider email
router.post("/verify-email", spController.verifyEmail);

// Update Service Provider
router.put("/update/:id",
    upload.fields([
        { name: "spShopImage", maxCount: 1 },
        { name: "spShopBannerImage", maxCount: 1 },
    ]), spController.updateServiceProvider);

// Delete Service Provider
router.delete("/delete/:id", spController.deleteServiceProvider); 

router.get("/sp_profile", authmiddleware.authServiceProvider, spController.getProfile);
//Get all Services provider routes
router.get('/', spController.getAllSP);
router.get("/sp_logout", authmiddleware.authServiceProvider, spController.logoutSP);

//get all details for services provider
router.get("/providers", spController.getAllServiceProviders);
// get service provider by id 
router.get("/providers/:id", spController.getServiceProviderById);

// Get dashboard statistics
router.get("/dashboard-stats/:spId", spController.getDashboardStats);

module.exports = router;
