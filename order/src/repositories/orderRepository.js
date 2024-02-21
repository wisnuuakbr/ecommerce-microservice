const Order = require("../models/order");

class OrderRepository {
    async createOrder(order) {
        try {
            return await Order.create(order);
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    async findById(orderId) {
        try {
            return await Order.findByPk(orderId);
        } catch (error) {
            console.error('Order not found:', error);
            throw error;
        }
    }

    async findAll() {
        try {
            return await Order.findAll();
        } catch (error) {
            console.error('Order not found:', error);
            throw error;
        }
    }
}

module.exports = OrderRepository;