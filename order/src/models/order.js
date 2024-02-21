const Product = require("../../../product/src/models/product");
const config = require("../config/db");
const { DataTypes } = require("sequelize");

const Order = config.define('Orders', {
    product: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        references: 'product',
        validate: {
            notEmpty: {
                msg: 'Product is required'
            }
        }
    },
    totalPrice: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: 'Total price must be greater than or equal to 0'
            }
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'orders',
    timestamps: false
});

// Relation many-to-many for both product and order
// Order.belongsToMany(Product, { through: 'OrderProduct' });
// Product.belongsToMany(Order, { through: 'OrderProduct' });

// Sync the model with the database
Order.sync()
    .then(() => {
        console.log('Order table synced successfully');
    })
    .catch(error => {
        console.log('Error syncing oder table:', error);
    })

module.exports = Order;