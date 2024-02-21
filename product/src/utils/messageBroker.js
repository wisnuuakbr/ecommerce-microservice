const amqp = require("amqplib");

class MessageBroker {
    constructor() {
        this.channel = null;
    }

    async connect() {
        console.log("Connecting to RabbitMQ...");
        setTimeout(async () => {
            try {
                const connection = await amqp.connect("amqp://localhost:5672");
                console.log("RabbitMQ connected");
                this.channel = await connection.createChannel();
                // Declare the queue if it doesn't exist
                await this.channel.assertQueue("product");
            } catch (error) {
                console.error("Failed to connect to RabbitMQ:", error.message);
            }
        }, 10000);
    }

    async sendMessage(queue, message) {
        if (!this.channel) {
            console.error("No channel available");
            return;
        }

        try {
            await this.channel.sendToQueue(
                queue,
                Buffer.from(JSON.stringify(message))
            );
        } catch (error) {
            console.log(error);
        }
    }

    async receiveMessage(queue, callback) {
        if (!this.channel) {
            console.error("No channel available");
        }

        try {
            await this.channel.consume(queue, (message) => {
                const messageContent = message.content.toString();
                const parsedMessage = JSON.parse(messageContent);
                callback(parsedMessage);
                this.channel.ack(message);
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new MessageBroker();