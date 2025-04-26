const express = require('express');
const { body } = require('express-validator');
const contactController = require('../controllers/contact.controller');
// const { authUser, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Validation middleware
const validateContactInput = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),

    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
];

const validateStatusUpdate = [
    body('status')
        .trim()
        .notEmpty().withMessage('Status is required')
        .isIn(['unread', 'read', 'replied']).withMessage('Status must be unread, read, or replied')
];

// Public routes
router.post('/', validateContactInput, contactController.createContact);

// Admin routes (protected)
router.get('/',  contactController.getAllContacts);
router.get('/:id', contactController.getContactById);
router.patch('/:id/status', validateStatusUpdate, contactController.updateContactStatus);
router.delete('/:id',contactController.deleteContact);

module.exports = router;
