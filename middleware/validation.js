const httpStatus = require('http-status');
const errors = require('../utils/error');
const consents = require('../utils/consents');
const { response } = require('../utils/response');

exports.requestValidator = (schema, property = 'body') => async (req, res, next) => {
    const data = req[property];
    try {
        const validatedData = schema.validate(data, {
            stripUnknown: { objects: true, arrays: true },
            convert: true,
            abortEarly: false,
        });

        if (validatedData.error) {
            const errorMessages = [];
            validatedData.error.details.forEach((errorObject) => {
                if (!errorMessages.includes(errorObject.context.key)) {
                    errorMessages.push(errorObject.context.key);
                }
            });
            const error = errors.BAD_REQUEST;
            error.message = consents.VALIDATION_ERROR + errorMessages;
            throw error;
        }
        next();
    } catch (error) {
        const result = response(
            true,
            httpStatus.OK,
            {
                errCode: error.errCode || errors.INTERNAL_SERVER_ERROR.errCode,
                errMsg: error.message || consents.INTERNAL_SERVER_ERROR,
            },
            '',
            null,
        );
        res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
};
