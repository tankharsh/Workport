const { body } = require("express-validator");
const spController = require("../controllers/sp.controller");
const authmiddleware = require("../middlewares/auth.middleware");
const router = require("express").Router();
const multer = require("multer");
const upload = require("../multer/multer");
const { validateRegisterSP, validateLoginSP } = require("../validators/sp.validator");


// Register Service Provider
router.post(
    "/sp_register",
    upload.fields([
        { name: "sp_shop_img", maxCount: 1 },
        { name: "sp_shop_banner_img", maxCount: 1 },
    ]),
    validateRegisterSP,
    spController.registerSP
);

// Login Service Provider
router.post("/sp_login", validateLoginSP, spController.loginSP);

// Update Service Provider
router.put("/update/:id", spController.updateServiceProvider);

// Delete Service Provider
router.delete("/delete/:id", spController.deleteServiceProvider); 

router.get("/sp_profile", authmiddleware.authServiceProvider, spController.getProfile);
//Get all Services provider routes
router.get('/', spController.getAllSP);
router.get("/sp_logout", authmiddleware.authServiceProvider, spController.logoutSP);
module.exports = router;
