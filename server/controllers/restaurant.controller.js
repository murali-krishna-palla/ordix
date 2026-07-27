const fs = require("fs");
const path = require("path");

const restaurantService = require("../services/restaurant.service");

const getProfile = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.getRestaurantProfile(
      req.user.restaurantId
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const restaurant =
      await restaurantService.updateRestaurantProfile(
        req.user.restaurantId,
        req.body
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully.",
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

const uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a logo.",
      });
    }

    const restaurant =
      await restaurantService.getRestaurantProfile(
        req.user.restaurantId
      );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
    }

    // Delete old logo
    if (restaurant.logo) {
      const oldLogoPath = path.join(
        __dirname,
        "..",
        restaurant.logo
      );

      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    const logoPath = `uploads/logos/${req.file.filename}`;

    await restaurantService.updateRestaurantLogo(
      req.user.restaurantId,
      logoPath
    );

    return res.status(200).json({
      success: true,
      message: "Logo uploaded successfully.",
      data: {
        logo: logoPath,
      },
    });
  } catch (error) {
    next(error);
  }
};

const uploadBanner = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a banner.",
      });
    }

    const restaurant = await restaurantService.getRestaurantProfile(
      req.user.restaurantId
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
    }

    // Delete old banner
    if (restaurant.banner) {
      const oldBannerPath = path.join(
        __dirname,
        "..",
        restaurant.banner
      );

      if (fs.existsSync(oldBannerPath)) {
        fs.unlinkSync(oldBannerPath);
      }
    }

    const bannerPath = `uploads/banners/${req.file.filename}`;

    await restaurantService.updateRestaurantBanner(
      req.user.restaurantId,
      bannerPath
    );

    return res.status(200).json({
      success: true,
      message: "Banner uploaded successfully.",
      data: {
        banner: bannerPath,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadLogo,
  uploadBanner,
};