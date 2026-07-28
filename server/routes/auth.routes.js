const express = require("express");
const router = express.Router();

const passport = require("passport");

const authController = require("../controllers/auth.controller");

const {
  registerOwnerValidator,
  loginValidator,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../validators/auth.validator");

const validate = require("../middleware/validation.middleware");
const authenticate = require("../middleware/authenticate");

// ==============================
// Test Route
// ==============================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth routes working",
  });
});

// ==============================
// Register
// ==============================
router.post(
  "/register-owner",
  registerOwnerValidator,
  validate,
  authController.register
);

// ==============================
// Login
// ==============================
router.post(
  "/login",
  loginValidator,
  validate,
  authController.login
);

// ==============================
// Super Admin Login
// ==============================
router.post(
  "/super-admin/login",
  loginValidator,
  validate,
  authController.login
);

// ==============================
// Google Login
// ==============================
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/v1/auth/google/failure",
  }),
  authController.googleCallback
);

router.get(
  "/google/failure",
  authController.googleFailure
);

// ==============================
// Current User
// ==============================
router.get(
  "/me",
  authenticate,
  authController.getMe
);

router.get(
  "/super-admin/me",
  authenticate,
  authController.getMe
);

// ==============================
// Change Password
// ==============================
router.patch(
  "/change-password",
  authenticate,
  authController.changePassword
);

// ==============================
// Logout
// ==============================
router.post(
  "/logout",
  authenticate,
  authController.logout
);

router.post(
  "/super-admin/logout",
  authenticate,
  authController.logout
);

// ==============================
// Forgot Password
// ==============================
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validate,
  authController.forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPasswordValidation,
  validate,
  authController.resetPassword
);

module.exports = router;