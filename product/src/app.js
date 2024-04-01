const express = require("express");
const config = require("./config/db");
const MessageBroker = require("./utils/messageBroker");
const productRouter = require("./routes/productRoutes.js");
require("dotenv").config();

class App {
    constructor() {
        this.app = express();
        this.connectDB();
        this.setMiddlewares();
        this.setRoutes();
        this.setMessageBroker();
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
        this.app.use("/product", productRouter);
    }

    setMessageBroker() {
        MessageBroker.connect();
    }

    start() {
        this.server = this.app.listen(3001, () => console.log("Server started on port 3001"));
    }

    async stop() {
        await this.disconnectDB();
        this.server.close();
        console.log("Server stopped");
    }
}

module.exports = App;
