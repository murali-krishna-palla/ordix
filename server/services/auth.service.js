const bcrypt = require("bcrypt");
const { User } = require("../models");

const { comparePassword } = require("../utils/password");

const { generateToken } = require("../utils/jwt");
const registrationRequestService = require("./registrationRequest.service");

class AuthService {
  // NOTE: Restaurant Owners are no longer created directly here.
  // Registration now creates a PENDING RestaurantRegistrationRequest and
  // waits for Super Admin approval before any Restaurant/User is created.
  // See registrationRequest.service.js for the approval workflow, and
  // auth.controller.js / registrationRequest.controller.js for the routes.
  async register(data) {
    const { restaurant = {}, owner = {} } = data;

    const ownerName = [owner.firstName, owner.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    return await registrationRequestService.registerRequest({
      restaurantName: restaurant.name,
      ownerName: ownerName || owner.email,
      email: owner.email,
      phone: owner.phone,
      password: owner.password,
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      country: restaurant.country,
      postalCode: restaurant.postalCode,
    });
  }

  async login(data) {
    const { email, password } = data;

    // Find User
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // Check Password
    const isPasswordValid = await comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    // Check Account Status
    if (!user.isActive) {
      throw new Error("Your account is not active. Please contact support.");
    }

    // Update Last Login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = generateToken({
      userId: user.id,
      restaurantId: user.restaurantId,
    });

    // Remove Password
    const userData = user.toJSON();
    delete userData.password;

    return {
      message: "Login successful.",
      token,
      user: userData,
    };
  }

  async getMe(userId) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const userData = user.toJSON();
    delete userData.password;

    return userData;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new Error("Current password is incorrect.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return {
      success: true,
      message: "Password changed successfully.",
    };
  }
}

module.exports = new AuthService();