const Joi = require('joi');

const addPost = Joi.object({
    description: Joi.string().max(500).required(),
});

const editPost = Joi.object({
    description: Joi.string().max(500),
});

module.exports = {
    addPost,
    editPost
}