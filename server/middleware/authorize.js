// Restricts access to users whose userType is one of the allowed types.
// Usage: router.get("/path", authenticate, authorize("SUPER_ADMIN"), handler)
const authorize = (...allowedUserTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!allowedUserTypes.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }

    next();
  };
};

module.exports = authorize;
