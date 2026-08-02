const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  // Log every error
  console.error("========== ERROR ==========");
  console.error("Name:", err.name);
  console.error("Message:", err.message);

  if (err.errors) {
    console.error(
      err.errors.map((e) => ({
        field: e.path,
        message: e.message,
        value: e.value,
      }))
    );
  }

  console.error(err);
  console.error("===========================");

  // Custom API errors
  if (err instanceof ApiError) {
    const errorPayload = {
      success: false,
      message: err.message,
    };

    if (err.code) {
      errorPayload.code = err.code;
    }

    return res.status(err.statusCode).json(errorPayload);
  }

  // Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: err.errors.map((e) => e.message).join(", "),
      errors: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Sequelize unique constraint
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      message: err.errors.map((e) => e.message).join(", "),
      errors: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Unknown errors
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;