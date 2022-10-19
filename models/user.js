const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 2,
        maxLength: 30,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        minLength: 6,
        maxLength: 45,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 60,
        required: true,
    },
    phoneNumber: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true,
    },
    token: {
        type: String,
        default: '',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,    
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);