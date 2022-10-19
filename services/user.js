const UserModel = require('../models/user');
const DatabaseService = require('../utils/dbService');

class UserService {
    constructor(userDetails) {
        this.user = {
            name: userDetails.name,
            username: userDetails.username,
            email: userDetails.email,
            password: userDetails.password,
            employeeId: userDetails.employeeId,
            manager: userDetails.manager || null,
            role: userDetails.role,
            status: userDetails.status,
        };
    }

    save() {
        return DatabaseService.insertOne(UserModel, this.user);
    }

    static findById(userId, projection = {}) {
        return DatabaseService.findOne(UserModel, {_id: userId, isDeleted: false}, projection);
    }

    static findByEmail(email, projection = {}) {
        return DatabaseService.findOne(UserModel, {email: email}, projection);
    }

    static findByUsername(username, projection = {}) {
        return DatabaseService.findOne(UserModel, {username: username}, projection);
    }

    static updateOne(userId, data, projection = {}) {
        return DatabaseService.updateOne(UserModel, {_id: userId, isDeleted: false}, {$set: data}, projection);
    }

}

module.exports = UserService;