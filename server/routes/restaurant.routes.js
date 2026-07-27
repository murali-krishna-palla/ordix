const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");
const validate = require("../middleware/validation.middleware");

const {
  uploadLogo,
  uploadBanner,
} = require("../middleware/upload.middleware");

const restaurantController = require("../controllers/restaurant.controller");

const {
  updateRestaurantValidation,
} = require("../validators/restaurant.validation");

router.get(
  "/profile",
  authenticate,
  restaurantController.getProfile
);

router.put(
  "/profile",
  authenticate,
  updateRestaurantValidation,
  validate,
  restaurantController.updateProfile
);

router.post(
  "/logo",
  authenticate,
  uploadLogo.single("logo"),
  restaurantController.uploadLogo
);

router.post(
  "/banner",
  authenticate,
  uploadBanner.single("banner"),
  restaurantController.uploadBanner
);

module.exports = router;