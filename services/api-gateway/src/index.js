const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "../.env" });
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
// app.use(express.json());

app.use(
  cors({
    origin: [`${process.env.CLIENT}`],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", async (req, res, next) => {
  try {
    return res.status(200).json({ status: 200, message: `API Version - ${process.env.API_VERSION} : Welcome to Api gateway :: latest : sonarCloud !` });
  } catch (error) {
    return next(error);
  }
});

app.use(
  `/api/v${process.env.API_VERSION}/auth`,
  createProxyMiddleware({
    target: `${process.env.AUTH_SERVICE_URL}/api/v${process.env.API_VERSION}/auth`,
    changeOrigin: true,
  })
);

app.use(
  `/api/v${process.env.API_VERSION}/event`,
  createProxyMiddleware({
    target: `${process.env.EVENT_SERVICE_URL}/api/v${process.env.API_VERSION}/event`,
    changeOrigin: true,
  })
);

app.use(
  `/api/v${process.env.API_VERSION}/notification`,
  createProxyMiddleware({
    target: `${process.env.NOTIFICATIONS_SERVICE_URL}/api/v${process.env.API_VERSION}/notification`,
    changeOrigin: true,
  })
);

app.listen(process.env.PORT, () => {
  console.log(`Gateway running on port ${process.env.PORT}`);
});
