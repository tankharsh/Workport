const spModel = require('../models/sp.module');

module.exports.createServiceProvider = async ({
    sp_name,
    sp_email,
    sp_contact,
    sp_shop_name,
    sp_category,
    sp_block_no,
    sp_area,
    sp_pincode,
    sp_city,
    sp_password,
    sp_shop_img,
    sp_shop_banner_img,
}) => {
    // Validate required fields
    if (
        !sp_name ||
        !sp_email ||
        !sp_contact ||
        !sp_shop_name ||
        !sp_category ||
        !sp_block_no ||
        !sp_area ||
        !sp_pincode ||
        !sp_city ||
        !sp_password
    ) {
        throw new Error('All fields are required');
    }

    // Create the service provider
    const serviceProvider = await spModel.create({
        sp_name,
        sp_email,
        sp_contact,
        sp_shop_name,
        sp_category,
        sp_block_no,
        sp_area,
        sp_pincode,
        sp_city,
        sp_password,
        sp_shop_img,
        sp_shop_banner_img,
    });

    return serviceProvider;
};

module.exports.findServiceProviderByEmail = async (sp_email) => {
    if (!sp_email) {
        throw new Error('Email is required');
    }

    const serviceProvider = await spModel.findOne({ sp_email });
    return serviceProvider;
};

module.exports.findServiceProviderById = async (id) => {
    if (!id) {
        throw new Error('ID is required');
    }

    const serviceProvider = await spModel.findById(id);
    return serviceProvider;
};

module.exports.updateServiceProvider = async (id, updateData) => {
    if (!id) {
        throw new Error('ID is required');
    }

    const updatedServiceProvider = await spModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true } // Return the updated document
    );

    return updatedServiceProvider;
};

module.exports.deleteServiceProvider = async (id) => {
    if (!id) {
        throw new Error('ID is required');
    }

    const deletedServiceProvider = await spModel.findByIdAndDelete(id);
    return deletedServiceProvider;
};
