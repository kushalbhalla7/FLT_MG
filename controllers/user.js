const httpStatus = require('http-status');
const errors = require('../utils/error');
const consents = require('../utils/consents');
const { response } = require('../utils/response');
const { encryptPassword, comparePassword, createToken } = require('../utils/helper');
const UserService = require('../services/user');

exports.register = async (req, res) => {
    const userData = req.body;

    try {
        const userExistsWithEmail = await UserService.findByEmail(userData.email, {_id: 1, email: 1});
        if (userExistsWithEmail) {
            const error = errors.CONFLICT;
            error.message = 'Email already exists';
            throw error;
        }

        const userExistsWithUsername = await UserService.findByUsername(userData.username, {_id: 1, username: 1});
        if (userExistsWithUsername) {
            const error = errors.CONFLICT;
            error.message = 'Username already exists';
            throw error;
        }

        userData.password = await encryptPassword(userData.password);
        const user = new UserService(userData).save();

        const result = response(
            true,
            httpStatus.OK,
            '',
            'User registred successfully',
            {
                _id: user._id
            },
        );
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        const result = response(
            true,
            null,
            error.status,
            {
                errCode: error.status || httpStatus.INTERNAL_SERVER_ERROR,
                errMsg: error.message || consents.INTERNAL_SERVER_ERROR,
            },
            '',
        );
        res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
}

exports.login = async (req, res) => {
    const userData = req.body;

    try {
        const userExistsWithEmail = await UserService.findByEmail(userData.email, {_id: 1, email: 1, role: 1, password: 1, isVerified: 1});
        if (!userExistsWithEmail) {
            const error = errors.UNAUTHORIZED;
            error.message = 'Email not found';
            throw error;
        }

        const passwordEqual = await comparePassword(userData.password, userExistsWithEmail.password)
        if (!passwordEqual) {
            const error = errors.UNAUTHORIZED;
            error.message = 'Password does not match';
            throw error;
        }

        if (!userExistsWithEmail.isVerified) {
            const error = errors.UNAUTHORIZED;
            error.message = 'Account is not verified yet by admin';
            throw error;
        }

        const authToken = createToken(userExistsWithEmail._id, userExistsWithEmail.role);
        await UserService.updateOne(userExistsWithEmail._id, {token: authToken});

        const result = response(
            true,
            httpStatus.OK,
            '',
            'User login successfully',
            {
                token: authToken
            },
        );
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        const result = response(
            true,
            null,
            error.status,
            {
                errCode: error.status || httpStatus.INTERNAL_SERVER_ERROR,
                errMsg: error.message || consents.INTERNAL_SERVER_ERROR,
            },
            '',
        );
        res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
}

exports.getUserProfile = async (req, res) => {

    try {
        const user = await UserService.findById(req._id, {password: 0});
        if (!user) {
            const error = errors.UNAUTHORIZED;
            error.message = 'User not found';
            throw error;
        }

        const result = response(
            true,
            httpStatus.OK,
            '',
            'User fetched successfully',
            user,
        );
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        const result = response(
            true,
            null,
            error.status,
            {
                errCode: error.status || httpStatus.INTERNAL_SERVER_ERROR,
                errMsg: error.message || consents.INTERNAL_SERVER_ERROR,
            },
            '',
        );
        res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
}

exports.verifyUser = async (req, res) => {
    const userId = req.query.userId;

    try {
        const user = await UserService.findById(userId, {password: 0});
        if (!user) {
            const error = errors.UNAUTHORIZED;
            error.message = 'User not found';
            throw error;
        }

        if (!user.isVerified) {
            await UserService.updateOne(userId, {isVerified: true});
        }

        const result = response(
            true,
            httpStatus.OK,
            '',
            'User verified successfully',
            {},
        );
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        const result = response(
            true,
            error.status,
            {
                errCode: error.status || httpStatus.INTERNAL_SERVER_ERROR,
                errMsg: error.message || consents.INTERNAL_SERVER_ERROR,
            },
            '',
            null,
        );
        res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
}

exports.updateUser = async (req, res) => {
    const userData = req.body;

    try {
        if (userData.email) {
            const userExistsWithEmail = await UserService.findByEmail(userData.email, {_id: 1, email: 1});
            if (userExistsWithEmail) {
                const error = errors.CONFLICT;
                error.message = 'Email already exists';
                throw error;
            }
        }
        if (userData.username) {
            const userExistsWithUsername = await UserService.findByUsername(userData.username, {_id: 1, username: 1});
            if (userExistsWithUsername) {
                const error = errors.CONFLICT;
                error.message = 'Username already exists';
                throw error;
            }
        }
        await UserService.updateOne(req._id, userData, {password: 0});
        const result = response(
            true,
            httpStatus.OK,
            '',
            'User updated successfully',
            {},
        );
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        const result = response(
            true,
            error.status,
            {
                errCode: error.status || httpStatus.INTERNAL_SERVER_ERROR,
                errMsg: error.message || consents.INTERNAL_SERVER_ERROR,
            },
            '',
            null,
        );
        res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
}

exports.deleteUser = async (req, res) => {

    try {
        await UserService.updateOne(req._id, { isDeleted: true, token: '' });

        const result = response(
            true,
            httpStatus.OK,
            '',
            'User deleted successfully',
            {},
        );
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        const result = response(
            true,
            error.status,
            {
                errCode: error.status || httpStatus.INTERNAL_SERVER_ERROR,
                errMsg: error.message || consents.INTERNAL_SERVER_ERROR,
            },
            '',
            null,
        );
        res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json(result);
    }
}