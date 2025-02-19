const express = require("express");
const router = express.Router();
const { sendInquiry, getInquiries, updateInquiryStatus } = require("../controllers/inquiry.controller");

router.post("/send", sendInquiry);
router.get("/:spId", getInquiries);
router.put("/status/:id", updateInquiryStatus);

module.exports = router;
