const express = require("express");
const router = express.Router();
const { sendInquiry, getInquiries, updateInquiryStatus ,deleteInquiry ,getUserInquiries } = require("../controllers/inquiry.controller");

router.post("/send", sendInquiry);
router.get("/:spId", getInquiries);
router.get("/user/:userId/inquiries", getUserInquiries);
router.put("/status/:id", updateInquiryStatus);
router.delete("/:id", deleteInquiry);

module.exports = router;
