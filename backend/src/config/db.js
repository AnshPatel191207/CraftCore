const mongoose = require('mongoose');

const connectDB = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            const conn = await mongoose.connect(process.env.MONGODB_URI);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            break;
        } catch (error) {
            console.error(`MongoDB connection error: ${error.message}`);
            retries -= 1;
            console.log(`Retries left: ${retries}. Waiting 5 seconds...`);
            if (retries === 0) {
                console.error('All MongoDB connection retries failed. Exiting...');
                process.exit(1);
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB runtime error: ${err.message}`);
});

module.exports = { connectDB };
