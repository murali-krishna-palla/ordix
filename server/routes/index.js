const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const restaurantRoutes = require("./restaurant.routes");
const registrationRequestRoutes = require("./registrationRequest.routes");

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

router.use("/auth", authRoutes);
router.use("/restaurants", restaurantRoutes);
router.use("/registration-requests", registrationRequestRoutes);

module.exports = router;