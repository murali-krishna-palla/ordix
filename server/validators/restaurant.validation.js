const { body } = require("express-validator");

const updateRestaurantValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Restaurant name must be between 2 and 100 characters."),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters."),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address."),

  body("phone")
    .optional()
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 and 15 digits."),

  body("website")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Please provide a valid website URL."),

  body("gstNumber")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Invalid GST Number."),

  body("fssaiNumber")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Invalid FSSAI Number."),

  body("address")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address is too short."),

  body("city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City is required."),

  body("state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State is required."),

  body("country")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Country is required."),

  body("postalCode")
    .optional()
    .trim()
    .isLength({ min: 4, max: 10 })
    .withMessage("Invalid postal code."),

  body("taxPercentage")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Tax percentage must be between 0 and 100."),

  body("serviceCharge")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Service charge must be between 0 and 100."),

  body("currency")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Currency is required."),

  body("timezone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Timezone is required."),

  body("language")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Language is required."),
];

module.exports = {
  updateRestaurantValidation,
};