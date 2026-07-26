const { body } = require("express-validator");

const registerOwnerValidator = [
  body("restaurant.name")
    .trim()
    .notEmpty()
    .withMessage("Restaurant name is required"),

  body("restaurant.email")
    .trim()
    .isEmail()
    .withMessage("Restaurant email is invalid"),

  body("restaurant.phone")
    .trim()
    .notEmpty()
    .withMessage("Restaurant phone is required"),

  body("restaurant.address")
    .trim()
    .notEmpty()
    .withMessage("Restaurant address is required"),

  body("restaurant.city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("restaurant.state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("owner.firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required"),

  body("owner.lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),

  body("owner.email")
    .trim()
    .isEmail()
    .withMessage("Owner email is invalid"),

  body("owner.password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("owner.phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits"),
];

const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

const forgotPasswordValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),
];

const resetPasswordValidation = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

module.exports = {
  registerOwnerValidator,
  loginValidator,
  forgotPasswordValidation,
  resetPasswordValidation,
};