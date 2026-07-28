const express = require("express");
const router = express.Router();

const registrationRequestController = require("../controllers/registrationRequest.controller");

const {
  registerRequestValidator,
  rejectRequestValidator,
} = require("../validators/registrationRequest.validation");

const validate = require("../middleware/validation.middleware");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const normalizeRegistrationRequest = require("../middleware/registrationRequest.middleware");

// ==============================
// Submit Registration Request (Public)
// ==============================
router.post(
  "/",
  normalizeRegistrationRequest,
  registerRequestValidator,
  validate,
  registrationRequestController.registerRequest
);

// ==============================
// Get Registration Requests (Super Admin Only)
// ==============================
router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN"),
  registrationRequestController.getRequests
);

// ==============================
// Get Registration Request By Id (Super Admin Only)
// ==============================
router.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  registrationRequestController.getRequestById
);

// ==============================
// Approve Registration Request (Super Admin Only)
// ==============================
router.patch(
  "/:id/approve",
  authenticate,
  authorize("SUPER_ADMIN"),
  registrationRequestController.approveRequest
);

// ==============================
// Reject Registration Request (Super Admin Only)
// ==============================
router.patch(
  "/:id/reject",
  authenticate,
  authorize("SUPER_ADMIN"),
  rejectRequestValidator,
  validate,
  registrationRequestController.rejectRequest
);

module.exports = router;
