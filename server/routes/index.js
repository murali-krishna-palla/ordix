const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const restaurantRoutes = require("./restaurant.routes");
const registrationRequestRoutes = require("./registrationRequest.routes");
const employeeRoutes = require("./employee.routes");
const roleRoutes = require("./role.routes");
const superAdminRoutes = require("./superAdmin.routes");

// =====================
// Health Check
// =====================

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

// =====================
// API Routes
// =====================

router.use("/auth", authRoutes);
router.use("/restaurants", restaurantRoutes);
router.use("/registration-requests", registrationRequestRoutes);
router.use("/employees", employeeRoutes);
router.use("/roles", roleRoutes);
router.use("/super-admin", superAdminRoutes);

module.exports = router;