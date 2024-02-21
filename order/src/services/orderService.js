const OrderRepository = require("../repositories/orderRepository");

class OrderService {
    constructor() {
        this.OrderRepository = new OrderRepository();
    }

    async createOrder(order) {
        return await this.OrderRepository.createOrder(order);
    }

    async getOrderById(orderId) {
        return await this.OrderRepository.findById(orderId);
    }

    async getOrder() {
        return await this.OrderRepository.findAll();
    }
}

module.exports = OrderService;