const config = require("../config/db");
const { DataTypes } = require("sequelize");

const User = config.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'users',
    timestamps: true
});
// Sync the model with the database
User.sync()
    .then(() => {
        console.log('User table synced successfully');
    })
    .catch(error => {
        console.error('Error syncing user table:', error)
    })

module.exports = User;