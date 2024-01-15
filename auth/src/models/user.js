const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Add email validation if needed (e.g., using a regular expression)
    },
});

module.exports = mongoose.model("User", UserSchema);