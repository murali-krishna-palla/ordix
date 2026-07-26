const { User } = require("../models");
const { verifyToken } = require("../utils/jwt");

const authenticate = async (req, res, next) => {
  try {
    // Get Authorization Header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    // Extract Token
    const token = authHeader.split(" ")[1];

    // Verify Token
    const decoded = verifyToken(token);

    // Find User
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check Account Status
    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    // Attach User
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authenticate;