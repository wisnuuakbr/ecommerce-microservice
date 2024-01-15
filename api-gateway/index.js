const express = require("express");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer();
const app = express();

// Route auth service
app.use("/auth", (req, res) => {
    proxy.web(req, res, { target: "http://auth:3000" });
})

// Start the server
const port = process.env.PORT || 3003;
app.listen(port, () => {
    console.log(`API Gateway listening on port ${port}`);
});