const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const errorHandler = require("./middleware/error.middleware");

// Register Models
require("./models");

const app = express();

// =====================
// Middlewares
// =====================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// =====================
// Routes
// =====================

app.use("/api/v1", routes);

// =====================
// 404 Handler
// =====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =====================
// Global Error Handler
// =====================

app.use(errorHandler);

module.exports = app;