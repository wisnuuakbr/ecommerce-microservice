const User = require("../models/user");

class UserRepository {
    async createUser(user) {
        return await User.create(user);
    }

    async getUserByUsername(username) {
        return await User.findOne({
            where: {
                username: username,
            },
        });
    }
}

module.exports = UserRepository;