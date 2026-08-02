const { Restaurant } = require("../models");

const getRestaurantById = async (restaurantId) => {
  return await Restaurant.findByPk(restaurantId);
};

const getAllRestaurants = async (status) => {
  const where = {};

  if (status) {
    where.status = status;
  }

  return await Restaurant.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });
};

const deleteRestaurant = async (restaurantId) => {
  const restaurant = await Restaurant.findByPk(restaurantId);
  if (!restaurant) return null;

  await restaurant.destroy({ force: true });
  return restaurant;
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
  getAllRestaurants,
  deleteRestaurant,
  updateRestaurant,
  updateLogo,
  updateBanner,
};