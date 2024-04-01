const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/userRepository");
const User = require("../models/user");

class AuthService {
    constructor() {
        this.UserRepository = new UserRepository();
    }

    // Get User
    async findUserByUsername(username) {
        const user = await User.findOne({
            where: {
                username: username,
            },
        });
        return user;
    }

    // Get User by ID
    async getUserById(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Login User
    async login(username, password) {
        const user = await this.UserRepository.getUserByUsername(username);
        if (!user) {
            return { success: false, message: "Invalid username or password" };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, message: "Invalid username or password" };
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { success: true, token };
    }

    // Register User
    async register(user) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        return await this.UserRepository.createUser(user);
    }

    // Delete test User
    async deleteTestUser() {
        // deleting all user with the username starts with "test"
        await User.deleteMany({ username: /^test/ });
    }
}

module.exports = AuthService;