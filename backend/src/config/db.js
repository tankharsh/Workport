const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connectionIN = await mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/workport');
        console.log(`MONGODB CONNECTED !! ${connectionIN.connection.host}`);
    } catch (err) {
        console.log("MONGODB CONNECTION FAILED!!", err);
        process.exit(1);
    }
}

export default {connectDB}