const Product = require("../models/product");

class ProductRepository {
    async createProduct(product) {
        try {
            return await Product.create(product);
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    async findById(productId) {
        try {
            return await Product.findByPk(productId);
        } catch (error) {
            console.error('Product not found:', error);
            throw error;
        }
    }

    async findAll() {
        try {
            return await Product.findAll();
        } catch (error) {
            console.error('Product not found:', error);
            throw error;
        }
    }
}

module.exports = ProductRepository;