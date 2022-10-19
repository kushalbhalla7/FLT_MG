const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const config = require('../config/env');

exports.encryptPassword = (password) => {
    return bcrypt.hash(password, 12);
};

exports.comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

exports.createToken = (userId, userRole, expireTime = '24hr') => {
    return jwt.sign(
        {
            _id: userId,
            role: userRole,
        },
        config.JWT_SECRET,
        { expiresIn: expireTime },
    );
};

exports.verifyToken = (authToken) => {
    return jwt.verify(authToken, config.JWT_SECRET);
};

exports.fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

exports.fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
};

exports.clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};