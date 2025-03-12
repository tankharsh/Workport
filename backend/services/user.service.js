const userModel = require('../models/user.model');


module.exports.createUser = async ({
    username, email, usercontactno, userAddress, password
}) => {
    if (!username || !email || !usercontactno || !password) {
        throw new Error('All fields are required');
    }
    const user = userModel.create({
        username,
        email,
        usercontactno,
        userAddress,
        password
    })

    return user;
}

