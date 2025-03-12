const spModel = require('../models/sp.module');

module.exports.createServiceProvider = async ({
    spName,
    spEmail,
    spContact,
    spShopName,
    spCategories,
    spBlockNo,
    spArea,
    spPincode,
    spCity,
    spDescription,
    spPassword,
    spShopImage,
    spShopBannerImage,
}) => {
    // Validate required fields
    if (
        !spName ||
        !spEmail ||
        !spContact ||
        !spShopName ||
        !spCategories ||
        !spBlockNo ||
        !spArea ||
        !spPincode ||
        !spCity ||
        !spDescription ||
        !spPassword
    ) {
        throw new Error('All fields are required');
    }

    // Create the service provider
    const serviceProvider = await spModel.create({
        spName,
        spEmail,
        spContact,
        spShopName,
        spCategories,
        spBlockNo,
        spArea,
        spPincode,
        spCity,
        spDescription,
        spPassword,
        spShopImage,
        spShopBannerImage,
    });

    return serviceProvider;
};

module.exports.findServiceProviderByEmail = async (spEmail) => {
    if (!spEmail) {
        throw new Error('Email is required');
    }

    const serviceProvider = await spModel.findOne({ spEmail });
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
        { new: true }
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
