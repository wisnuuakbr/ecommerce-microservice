const AuthService = require("../services/authService");

class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    // Login
    async login(req, res) {
        const { username, password } = req.body;
        const result = await this.authService.login(username, password);

        if (result.success) {
            res.json({ token: result.token });
        } else {
            res.status(400).json({ message: result.message });
        }
    }

    // Register
    async register(req, res) {
        const user = req.body;
        try {
            const existingUser = await this.authService.findUserByUsername(user.username);

            if (existingUser) {
                throw new Error("Username already taken");
            }

            const result = await this.authService.register(user);
            res.json(result);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    // Get Profile
    async getProfile(req, res) {
        const userId = req.user.id;
        try {
            const user = await this.authService.getUserById(userId);
            res.json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = AuthController;