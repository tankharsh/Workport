const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');
const { isAdmin } = require('../middlewares/auth.middleware');

// Public route for processing user queries
router.post('/query', chatbotController.processQuery);

// Admin routes for managing FAQs
// For development, temporarily making these routes public
// IMPORTANT: Add isAdmin middleware back in production!
router.get('/faqs', chatbotController.getAllFAQs);
router.post('/faqs', chatbotController.addFAQ);
router.put('/faqs/:id', chatbotController.updateFAQ);
router.delete('/faqs/:id', chatbotController.deleteFAQ);

// Uncomment these routes and comment out the above ones when ready for production
/*
router.get('/faqs', isAdmin, chatbotController.getAllFAQs);
router.post('/faqs', isAdmin, chatbotController.addFAQ);
router.put('/faqs/:id', isAdmin, chatbotController.updateFAQ);
router.delete('/faqs/:id', isAdmin, chatbotController.deleteFAQ);
*/

module.exports = router; 