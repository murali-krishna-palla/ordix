const { Restaurant } = require("../models");

const getRestaurantById = async (restaurantId) => {
  return await Restaurant.findByPk(restaurantId);
};

const updateRestaurant = async (restaurantId, updateData) => {
  const restaurant = await Restaurant.findByPk(restaurantId);

  if (!restaurant) return null;

  await restaurant.update(updateData);

  return restaurant;
};

const updateLogo = async (restaurantId, logoPath) => {
  const restaurant = await Restaurant.findByPk(restaurantId);

  if (!restaurant) return null;

  restaurant.logo = logoPath;

  await restaurant.save();

  return restaurant;
};

const updateBanner = async (restaurantId, bannerPath) => {
  const restaurant = await Restaurant.findByPk(restaurantId);

  if (!restaurant) return null;

  restaurant.banner = bannerPath;

  await restaurant.save();

  return restaurant;
};

module.exports = {
  getRestaurantById,
  updateRestaurant,
  updateLogo,
  updateBanner,
};