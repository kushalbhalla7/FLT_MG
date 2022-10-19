const httpStatus = require('http-status');
const errors = require('../utils/error');
const consents = require('../utils/consents');
const { verifyToken } = require('../utils/helper');
const { response } = require('../utils/response');
const UserService = require('../services/user');

// validate authorization header token with user's token
const validateUserToken = async (userId, token) => {
    const userDetails = await UserService.findById(userId, {_id: 1, token: 1, isVerified: 1});
    if (!userDetails) {
        const error = errors.UNAUTHORIZED;
        error.message = '';
        return error;
    }

    if (!userDetails.token) {
        const error = errors.UNAUTHORIZED;
        error.message = 'User is logged out';
        return error;
    }

    if (userDetails.token !== token) {
        const error = errors.UNAUTHORIZED;
        error.message = consents.TOKEN_INVALID;
        return error;
    }

    if (!userDetails.isVerified) {
        const error = errors.FORBIDDEN;
        error.message = 'User is not verified';
        return error;
    }

    return '';
};


// validate that token is valid or not
const validateToken = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            const error = errors.UNAUTHORIZED;
            error.message = consents.AUTHORIZATON_ERROR;
            throw error;
        }

        // auth token extracting from header
        const authToken = authHeader.split(' ')[1];
        let decodedToken;
        try {
            decodedToken = verifyToken(authToken, );
        } catch (err) {
            const error = errors.UNAUTHORIZED;
            error.message = err.message;
            throw error;
        }
        if (!decodedToken) {
            const error = errors.UNAUTHORIZED;
            error.message = consents.TOKEN_INVALID;
            throw error;
        }

        const error = await validateUserToken(decodedToken._id, authToken);
        if (error) {
            throw error;
        }

        req._id = decodedToken._id;
        req.role = decodedToken.role;
        next();
    } catch (error) {
        const result = response(
            true,
            null,
            httpStatus.OK,
            {
                errCode: error.errCode || errors.INTERNAL_SERVER_ERROR.errCode,
                errMsg: error.message || consents.INTERNAL_SERVER_ERROR,
            },
            '',
        );
        res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
};

// validate token and varify role user
const validateTokenAndVerifyUser = (req, res, next) => {
    validateToken(req, res, () => {
        if ((req.role === 'user')) {
            next();
        } else {
            const result = response(
                true,
                null,
                httpStatus.OK,
                {
                    errCode: errors.FORBIDDEN.errCode,
                    errMsg: consents.FORBIDDEN_ERROR,
                },
                '',
            );
            res.status(httpStatus.FORBIDDEN).json(result);
        }
    });
};

// validate token and varify role user
const validateTokenAndVerifyAdmin = (req, res, next) => {
    validateToken(req, res, () => {
        if ((req.role === 'admin')) {
            next();
        } else {
            const result = response(
                true,
                null,
                httpStatus.OK,
                {
                    errCode: errors.FORBIDDEN.errCode,
                    errMsg: consents.FORBIDDEN_ERROR,
                },
                '',
            );
            res.status(httpStatus.FORBIDDEN).json(result);
        }
    });
};

module.exports = {
    validateToken,
    validateTokenAndVerifyUser,
    validateTokenAndVerifyAdmin,
}