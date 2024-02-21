const amqp = require("amqplib");
// const config = require("../config");
const Order = require("../models/order");
const OrderService = require("../services/orderService");

class MessageBroker {

    constructor() {
        this.channel = null;
    }

    static async connect() {
        try {
            const connection = await amqp.connect("amqp://localhost:5672");
            console.log("RabbitMQ connected");
            this.channel = await connection.createChannel();

            // Declare the order queue
            await this.channel.assertQueue('order', { durable: true });

            // Consume messages from the order queue on buy
            this.channel.consume('order', async (message) => {
                try {
                    const order = JSON.parse(message.content.toString());
                    const orderService = new OrderService();
                    await orderService.createOrder(order);
                    this.channel.ack(message);
                } catch (error) {
                    console.error(error);
                    this.channel.reject(message, false);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    static async setupOrderConsumer() {
        console.log("Connecting to RabbitMQ...");

        setTimeout(async () => {
            try {
                const connection = await amqp.connect("amqp://localhost:5672");
                console.log("RabbitMQ connected");
                const channel = await connection.createChannel();
                // Declare the queue if it doesn't exist
                await this.channel.assertQueue("order");

                this.channel.consume('order', async (data) => {
                    // Consume messages from the order queue on buy
                    console.log("Consuming ORDER service");
                    const { products, username, orderId } = JSON.parse(data.content);

                    const newOrder = new Order({
                        products,
                        user: username,
                        totalPrice: products.reduce((acc, product) => acc + product.price, 0),
                    });

                    // Save order to DB
                    await newOrder.save();

                    // Send ACK to ORDER service
                    this.channel.ack(data);
                    console.log("Order saved to DB and ACK sent to ORDER queue");

                    // Send fulfilled order to PRODUCTS service
                    // Include orderId in the message
                    const { user, products: savedProducts, totalPrice } = newOrder.toJSON();
                    this.channel.sendToQueue(
                        "order",
                        Buffer.from(JSON.stringify({ orderId, user, products: savedProducts, totalPrice }))
                    );
                });
            } catch (err) {
                console.error("Failed to connect to RabbitMQ:", err.message);
            }
        }, 10000); // add a delay to wait for RabbitMQ to start in docker-compose
    }
}

module.exports = MessageBroker;
