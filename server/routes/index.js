const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const restaurantRoutes = require("./restaurant.routes");

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

router.use("/auth", authRoutes);
router.use("/restaurants", restaurantRoutes);

module.exports = router;