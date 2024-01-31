const jwt = require('jsonwebtoken');
require('dotenv').config();

function isAuthenticated(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const Token = jwt.verify(token, process.env.JWT_SECRET);
        req.user = Token;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = isAuthenticated;