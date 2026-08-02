const roleService = require("../services/role.service");

const getRoles = async (req, res, next) => {
  try {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const roles = await roleService.getRoles(restaurantId);

    return res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoles,
};
