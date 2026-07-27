const restaurantRepository = require("../repositories/restaurant.repository");

const getRestaurantProfile = async (restaurantId) => {
  return await restaurantRepository.getRestaurantById(restaurantId);
};

const updateRestaurantProfile = async (restaurantId, data) => {
  return await restaurantRepository.updateRestaurant(
    restaurantId,
    data
  );
};

const updateRestaurantLogo = async (restaurantId, logoPath) => {
  return await restaurantRepository.updateLogo(
    restaurantId,
    logoPath
  );
};

const updateRestaurantBanner = async (restaurantId, bannerPath) => {
  return await restaurantRepository.updateBanner(
    restaurantId,
    bannerPath
  );
};

module.exports = {
  getRestaurantProfile,
  updateRestaurantProfile,
  updateRestaurantLogo,
  updateRestaurantBanner,
};