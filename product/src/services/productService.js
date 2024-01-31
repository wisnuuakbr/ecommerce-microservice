const ProductRepository = require("../repositories/productRepository");

class ProductService {
    constructor() {
        this.ProductRepository = new ProductRepository();
    }

    async createProduct(product) {
        return await this.ProductRepository.createProduct(product);
    }

    async getProductById(productId) {
        return await this.ProductRepository.findById(productId);
    }

    async getProduct() {
        return await this.ProductRepository.findAll();
    }
}

module.exports = ProductService;