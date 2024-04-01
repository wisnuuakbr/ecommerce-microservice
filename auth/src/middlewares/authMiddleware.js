const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).json({ message: "Authorization failed: No token provided" });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        console.error("Error validating token:", error.message);
        res.status(401).json({ message: "Authorization failed: Invalid token" });
    }
};