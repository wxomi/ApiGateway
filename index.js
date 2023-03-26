const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { checkAuthenticationUser, checkIsAdmin } = require("./middlewares");

const app = express();

const PORT = 3005;

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

app.use(morgan("combined"));
// // Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(
  "/authservice",
  createProxyMiddleware({
    target: "http://localhost:3001/",
    changeOrigin: true,
  })
);

app.use("/bookingservice", checkAuthenticationUser.checkAuthentication);
app.use(
  "/bookingservice",
  createProxyMiddleware({
    target: "http://localhost:3002/",
    changeOrigin: true,
  })
);

app.use("/flightservice", checkIsAdmin.checkIsAdmin);
app.use(
  "/flightservice",
  createProxyMiddleware({
    target: "http://localhost:3000/",
    changeOrigin: true,
  })
);
app.listen(PORT, () => {
  console.log("Server started at port: ", PORT);
});
