const restaurantService = require("../services/restaurant.service");

const getRestaurants = async (req, res, next) => {
  try {
    const { status } = req.query;
    const restaurants = await restaurantService.getAllRestaurants(status);

    return res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.deleteRestaurant(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant removed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRestaurants,
  deleteRestaurant,
};
