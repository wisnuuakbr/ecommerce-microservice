const config = require("../config/db");
const { DataTypes } = require('sequelize')

const Product = config.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Name is required'
            }
        }
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Price is required'
            },
            min: {
                args: [0],
                msg: 'Price must be greater than or equal to 0'
            }
        }
    },
    description: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'products',
    timestamps: true
});
// Sync the model with the database
Product.sync()
    .then(() => {
        console.log('Product table synced successfully');
    })
    .catch(error => {
        console.log('Error syncing product table:', error)
    })

module.exports = Product;