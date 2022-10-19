const Joi = require('joi');

const emailRegex = `([a-z]+((.[a-z]+)([1-9]+)?)+)(@gmail+(.com)+)`;

const registerUser = Joi.object({
    username: Joi.string().min(2).max(30).required(),
    email: Joi.string().pattern(new RegExp(emailRegex)).required(),
    password: Joi.string().min(6).required(),
});

const login = Joi.object({
    email: Joi.string().pattern(new RegExp(emailRegex)).required(),
    password: Joi
        .string()
        .required(),
});

const updateUser = Joi.object({
    username: Joi.string().min(2).max(30),
    email: Joi.string().pattern(new RegExp(emailRegex)),
    phoneNumber: Joi.string().min(10),
});

module.exports = {
    registerUser,
    login,
    updateUser
}
