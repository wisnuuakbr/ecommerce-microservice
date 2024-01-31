const User = require("../models/user");

class UserRepository {
    async createUser(user) {
        try {
            return await User.create(user);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async getUserByUsername(username) {
        try {
            return await User.findOne({
                where: {
                    username: username,
                },
            });
        } catch (error) {
            console.error('Error getting user by username:', error);
            throw error;
        }
    }
}

module.exports = UserRepository;