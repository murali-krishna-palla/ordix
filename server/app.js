const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

const routes = require("./routes");
const errorHandler = require("./middleware/error.middleware");

// Register Models
require("./models");

const app = express();

// =====================
// Middlewares
// =====================

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// =====================
// Static Files
// =====================

app.use("/uploads", express.static("uploads"));

// =====================
// API Routes
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