const { body } = require("express-validator");

const registerRequestValidator = [
  body("restaurantName")
    .trim()
    .notEmpty()
    .withMessage("Restaurant name is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Restaurant name must be between 2 and 100 characters."),

  body("ownerName")
    .trim()
    .notEmpty()
    .withMessage("Owner name is required."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address."),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 and 15 digits."),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required."),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required."),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required."),

  body("country")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Country cannot be empty."),

  body("postalCode")
    .optional()
    .trim(),
];

const rejectRequestValidator = [
  body("rejectionReason")
    .trim()
    .notEmpty()
    .withMessage("A rejection reason is required."),
];

module.exports = {
  registerRequestValidator,
  rejectRequestValidator,
};
