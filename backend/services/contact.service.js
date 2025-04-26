const Contact = require('../models/contact.model');

/**
 * Create a new contact message
 * @param {Object} contactData - Contact message data
 * @returns {Promise<Object>} Created contact message
 */
const createContact = async (contactData) => {
    try {
        const contact = new Contact(contactData);
        await contact.save();
        return contact;
    } catch (error) {
        throw error;
    }
};

/**
 * Get all contact messages
 * @param {Object} filter - Filter criteria
 * @param {Object} options - Query options (sort, pagination, etc.)
 * @returns {Promise<Array>} List of contact messages
 */
const getAllContacts = async (filter = {}, options = {}) => {
    try {
        const contacts = await Contact.find(filter)
            .sort(options.sort || { createdAt: -1 })
            .skip(options.skip || 0)
            .limit(options.limit || 100);
        
        return contacts;
    } catch (error) {
        throw error;
    }
};

/**
 * Get contact message by ID
 * @param {string} id - Contact message ID
 * @returns {Promise<Object>} Contact message
 */
const getContactById = async (id) => {
    try {
        const contact = await Contact.findById(id);
        if (!contact) {
            throw new Error('Contact message not found');
        }
        return contact;
    } catch (error) {
        throw error;
    }
};

/**
 * Update contact message status
 * @param {string} id - Contact message ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated contact message
 */
const updateContactStatus = async (id, status) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );
        
        if (!contact) {
            throw new Error('Contact message not found');
        }
        
        return contact;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete contact message
 * @param {string} id - Contact message ID
 * @returns {Promise<Object>} Deleted contact message
 */
const deleteContact = async (id) => {
    try {
        const contact = await Contact.findByIdAndDelete(id);
        
        if (!contact) {
            throw new Error('Contact message not found');
        }
        
        return contact;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createContact,
    getAllContacts,
    getContactById,
    updateContactStatus,
    deleteContact
};
