const express = require("express");
const config = require("./config/db");
const MessageBroker = require("./utils/messageBroker");

class App {
    constructor() {
        this.app = express();
        this.connectDB();
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

    setMessageBroker() {
        MessageBroker.connect();
        MessageBroker.setupOrderConsumer();
    }

    start() {
        this.server = this.app.listen(3002, () => console.log("Server started on port 3002"));
    }

    async stop() {
        await this.disconnectDB();
        this.server.close();
        console.log("Server stopped");
    }

}
module.exports = App;