const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const PORT = 3005;

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

app.use(morgan("combined"));
// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(
  "/bookingservice",
  createProxyMiddleware({
    target: "http://localhost:3001/",
    changeOrigin: true,
  })
);
app.get("/home", (req, res) => {
  console.log("hi");
  return res.status(200).json({
    message: "OK",
  });
});
app.listen(PORT, () => {
  console.log("Server started at port: ", PORT);
});
