const mongoose = require('mongoose');
const { DB_URI } = require('./env');

const dbConnection = async (cb) => {
    try {
        const db = await mongoose.connect(DB_URI);
        if (!db) {
            throw new Error('DATABASE_NOT_CONNECTED');
        }
        return cb({ error: false });
    } catch (err) {
        return cb({ error: true, message: err.message });
    }
};

module.exports = dbConnection;
