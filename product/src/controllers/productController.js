const Product = require("../models/product")
const uuid = require("uuid");
const messageBroker = require("../utils/messageBroker");

class ProductController {
    constructor() {
        this.createOrder = this.createOrder.bind(this);
        this.getOrderStatus = this.getOrderStatus.bind(this);
        this.ordersMap = new Map();
    }

    async createProduct(req, res, next) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const product = await Product.create(req.body);
            // Handle validation errors
            if (!product) {
                return res.status(400).json({ message: "Validation failed", errors: [{ message: "Invalid product data" }] });
            }

            await product.save({ timeout: 3000 });
            res.status(201).json(product);

        } catch (error) {
            // Check if the error is a Sequelize validation error
            if (error.name === 'SequelizeValidationError') {
                // Extract validation error messages
                const validationErrors = error.errors.map(err => ({ message: err.message }));
                return res.status(400).json({ message: "Validation failed", errors: validationErrors });
            }
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    async createOrder(req, res, next) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const product_ids = req.body.product_id.map(id => parseInt(id));
            const product = await Product.findAll({ where: { id: product_ids } });

            // Validasi apakah produk tersedia
            if (product.length !== product_ids.length) {
                return res.status(404).json({ message: "One or more products not found" });
            }

            // generate uuid
            const orderId = uuid.v4();
            this.ordersMap.set(orderId, {
                status: "pending",
                product,
                username: req.user.username
            });

            await messageBroker.publishMessage("order", {
                product,
                username: req.user.username,
                // include the order ID in the message to orders queue
                orderId,
            });

            messageBroker.consumeMessage("product", (data) => {
                try {
                    const orderData = JSON.parse(JSON.stringify(data));
                    const { orderId } = orderData;
                    const order = this.ordersMap.get(orderId);
                    if (order) {
                        // update the order in the map
                        this.ordersMap.set(orderId, { ...order, ...orderData, status: 'completed' });
                        console.log("Updated order:", order);
                    } else {
                        console.error("Received message for unknown order id:", orderId);
                    }
                } catch (error) {
                    console.error("Error processing received message:", error);
                }
            });

            // Long polling until order is completed
            let order = this.ordersMap.get(orderId);
            while (order.status !== 'completed') {
                // set time wait for 1 second before checking status again
                await new Promise(resolve => setTimeout(resolve, 1000));
                order = this.ordersMap.get(orderId);
            }
            // Once the order is marked as completed, return the complete order details
            return res.status(201).json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    async getOrderStatus(req, res, next) {
        const { orderId } = req.params;
        const order = this.ordersMap.get(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json(order);
    }

    async getProducts(req, res, next) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const product = await Product.findAll({});
            res.status(200).json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = ProductController;