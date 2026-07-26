const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  console.log("✅ Validation middleware executed");
console.log("BODY:", JSON.stringify(req.body, null, 2));
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("❌ Validation Errors:");
    console.log(JSON.stringify(errors.array(), null, 2));

    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  next();
};

module.exports = validate;