const { validationResult } = require('express-validator');
const contactService = require('../services/contact.service');

/**
 * Create a new contact message
 * @route POST /api/contact
 */
const createContact = async (req, res, next) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, message } = req.body;

        // Create contact message
        const contact = await contactService.createContact({
            name,
            email,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon!',
            data: contact
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all contact messages
 * @route GET /api/contact
 */
const getAllContacts = async (req, res, next) => {
    try {
        // Extract query parameters
        const { status, sort, page = 1, limit = 10 } = req.query;
        
        // Build filter
        const filter = {};
        if (status) {
            filter.status = status;
        }
        
        // Build options
        const options = {
            sort: sort ? { [sort]: -1 } : { createdAt: -1 },
            skip: (page - 1) * limit,
            limit: parseInt(limit)
        };
        
        // Get contacts
        const contacts = await contactService.getAllContacts(filter, options);
        
        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get contact message by ID
 * @route GET /api/contact/:id
 */
const getContactById = async (req, res, next) => {
    try {
        const contact = await contactService.getContactById(req.params.id);
        
        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        if (error.message === 'Contact message not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};

/**
 * Update contact message status
 * @route PATCH /api/contact/:id/status
 */
const updateContactStatus = async (req, res, next) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { status } = req.body;
        
        const contact = await contactService.updateContactStatus(req.params.id, status);
        
        res.status(200).json({
            success: true,
            message: 'Contact status updated successfully',
            data: contact
        });
    } catch (error) {
        if (error.message === 'Contact message not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};

/**
 * Delete contact message
 * @route DELETE /api/contact/:id
 */
const deleteContact = async (req, res, next) => {
    try {
        await contactService.deleteContact(req.params.id);
        
        res.status(200).json({
            success: true,
            message: 'Contact message deleted successfully',
            data: null
        });
    } catch (error) {
        if (error.message === 'Contact message not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};

module.exports = {
    createContact,
    getAllContacts,
    getContactById,
    updateContactStatus,
    deleteContact
};
