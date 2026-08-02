const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const superAdminController = require("../controllers/superAdmin.controller");

router.get(
  "/restaurants",
  authenticate,
  authorize("SUPER_ADMIN"),
  superAdminController.getRestaurants
);

router.delete(
  "/restaurants/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  superAdminController.deleteRestaurant
);

module.exports = router;
