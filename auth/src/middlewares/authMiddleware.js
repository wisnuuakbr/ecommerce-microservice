const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = function (req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decode = jwt.verify(token, config.jwtSecret);
        req.user = decode;
        next();
    } catch (e) {
        res.status(400).json({ message: "Token is not valid" });
    }
};