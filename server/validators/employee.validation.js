const { body, param } = require("express-validator");

const createEmployeeValidation = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required."),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required."),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email is required."),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters."),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required."),

    body("roleId")
        .isUUID()
        .withMessage("Valid role is required."),

    body("department")
        .optional()
        .isIn([
            "MANAGEMENT",
            "KITCHEN",
            "SERVICE",
            "DELIVERY",
            "RECEPTION",
            "ACCOUNTS",
            "OTHER",
        ]),

    body("employmentType")
        .optional()
        .isIn([
            "FULL_TIME",
            "PART_TIME",
            "CONTRACT",
            "INTERN",
        ]),

    body("shift")
        .optional()
        .isIn([
            "MORNING",
            "AFTERNOON",
            "EVENING",
            "NIGHT",
        ]),
];

const updateEmployeeValidation = [
    param("id")
        .isUUID()
        .withMessage("Invalid employee id."),
];

const employeeIdValidation = [
    param("id")
        .isUUID()
        .withMessage("Invalid employee id."),
];

module.exports = {
    createEmployeeValidation,
    updateEmployeeValidation,
    employeeIdValidation,
};