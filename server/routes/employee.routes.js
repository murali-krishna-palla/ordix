const express = require("express");

const router = express.Router();

const employeeController = require("../controllers/employee.controller");

const {
    createEmployeeValidation,
    updateEmployeeValidation,
    employeeIdValidation,
} = require("../validators/employee.validation");

const validateRequest = require("../middleware/validation.middleware");
const authenticate = require("../middleware/authenticate");

// Create Employee
router.post(
    "/",
    authenticate,
    createEmployeeValidation,
    validateRequest,
    employeeController.createEmployee
);

// Get Employees
router.get(
    "/",
    authenticate,
    employeeController.getEmployees
);

// Get Employee By Id
router.get(
    "/:id",
    authenticate,
    employeeIdValidation,
    validateRequest,
    employeeController.getEmployeeById
);

// Update Employee
router.put(
    "/:id",
    authenticate,
    updateEmployeeValidation,
    validateRequest,
    employeeController.updateEmployee
);

// Change Employee Role
router.patch(
    "/:id/role",
    authenticate,
    employeeIdValidation,
    validateRequest,
    employeeController.changeEmployeeRole
);

// Update Employee Status
router.patch(
    "/:id/status",
    authenticate,
    employeeIdValidation,
    validateRequest,
    employeeController.updateEmployeeStatus
);

// Delete Employee
router.delete(
    "/:id",
    authenticate,
    employeeIdValidation,
    validateRequest,
    employeeController.deleteEmployee
);

module.exports = router;