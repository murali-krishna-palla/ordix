const authService = require("../services/auth.service");
const { generateToken } = require("../utils/jwt");
const { User } = require("../models");

const crypto = require("crypto");
const { Op } = require("sequelize");

const sendEmail = require("../utils/email");
const { hashPassword } = require("../utils/password");

// ==============================
// Register Restaurant + Owner
// ==============================
const register = async (req, res, next) => {
  try {
    console.log("\n========== REGISTER ENDPOINT HIT ==========");
    console.log("Request body received");

    // Registration no longer creates an active account. authService.register
    // now adapts this endpoint's payload shape and forwards it to the
    // Registration Request Service, creating a PENDING request that awaits
    // Super Admin approval.
    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.request,
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    next(error);
  }
};

// ==============================
// Login
// ==============================
const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body, req.isSuperAdmin);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Google Login Success
// ==============================
const googleCallback = async (req, res, next) => {
  try {
    const user = req.user;

    const token = generateToken({
      userId: user.id,
      restaurantId: user.restaurantId,
    });

    // Redirect to frontend with token as query parameter
    const frontendCallbackUrl = process.env.FRONTEND_CALLBACK_URL || "http://localhost:5173/auth/google/callback";
    res.redirect(`${frontendCallbackUrl}?token=${token}`);
  } catch (error) {
    next(error);
  }
};

// ==============================
// Google Login Failure
// ==============================
const googleFailure = (req, res) => {
  res.status(401).json({
    success: false,
    message: "Google authentication failed.",
  });
};

// ==============================
// Get Logged-in User
// ==============================
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Change Password
// ==============================
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const result = await authService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Logout
// ==============================
const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Forgot Password
// ==============================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    // Prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: "ORDIX Password Reset",
      html: `
        <h2>Password Reset Request</h2>

        <p>Hello ${user.firstName},</p>

        <p>You requested to reset your password.</p>

        <p>
          <a href="${resetURL}">
            Reset Password
          </a>
        </p>

        <p>This link expires in <strong>15 minutes</strong>.</p>

        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send password reset email.",
    });
  }
};

// ==============================
// Reset Password
// ==============================
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    user.password = await hashPassword(password);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to reset password.",
    });
  }
};

module.exports = {
  register,
  login,
  googleCallback,
  googleFailure,
  getMe,
  changePassword,
  logout,
  forgotPassword,
  resetPassword,
};