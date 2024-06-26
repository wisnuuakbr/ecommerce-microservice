const express = require("express");
const config = require("./config/db");
const authMiddleware = require("./middlewares/authMiddleware");
const AuthController = require("./controllers/authController");

class App {
    constructor() {
        this.app = express();
        this.authController = new AuthController();
        this.connectDB();
        this.setMiddlewares();
        this.setRoutes();
    }

    async connectDB() {
        try {
            await config.authenticate();
            console.log("PostgreSQL connected");
        } catch (error) {
            console.error("Unable to connect to the database:", error);
        }
    }

    async disconnectDB() {
        await config.close();
        console.log("PostgreSQL disconnected");
    }

    setMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    setRoutes() {
        this.app.post("/login", (req, res) => this.authController.login(req, res));
        this.app.post("/register", (req, res) => this.authController.register(req, res));
        this.app.get("/profile", authMiddleware, (req, res) => this.authController.getProfile(req, res));
        this.app.get("/dashboard", authMiddleware, (req, res) => res.json({ message: "Welcome to dashboard" }));
    }

    start() {
        this.server = this.app.listen(3000, () => console.log("Server started on port 3000"));
    }

    async stop() {
        await this.disconnectDB();
        this.server.close();
        console.log("Server stopped");
    }
}

module.exports = App;