const mongoose = require("mongoose");

const connectDB = async () => {
    if (!process.env.DB_CONNECTION_SECRET) {
        throw new Error("DB_CONNECTION_SECRET is not defined in environment variables");
    }
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};

module.exports = connectDB;