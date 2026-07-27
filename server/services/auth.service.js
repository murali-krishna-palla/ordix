const bcrypt = require("bcrypt");
const {
  sequelize,
  Restaurant,
  User,
  UserRole,
} = require("../models");

const roleService = require("./role.service");

const {
  hashPassword,
  comparePassword,
} = require("../utils/password");

const { generateToken } = require("../utils/jwt");

class AuthService {
  async register(data) {
    const transaction = await sequelize.transaction();

    try {
      console.log("\n========== REGISTRATION START ==========");
      const { restaurant, owner } = data;

      // Check if restaurant email already exists
      const existingRestaurant = await Restaurant.findOne({
        where: {
          email: restaurant.email,
        },
      });

      if (existingRestaurant) {
        throw new Error("Restaurant email already exists.");
      }
      console.log("✅ Restaurant email unique");

      // Check if owner email already exists
      const existingUser = await User.findOne({
        where: {
          email: owner.email,
        },
      });

      if (existingUser) {
        throw new Error("Owner email already exists.");
      }
      console.log("✅ Owner email unique");

      // Create Restaurant
      const createdRestaurant = await Restaurant.create(
        {
          name: restaurant.name,
          email: restaurant.email,
          phone: restaurant.phone,
          address: restaurant.address,
          city: restaurant.city,
          state: restaurant.state,
        },
        { transaction }
      );
      console.log("✅ Restaurant created:", createdRestaurant.id);

      // Hash Password
      const hashedPassword = await hashPassword(owner.password);
      console.log("✅ Password hashed");

      // Create Owner User
      const createdUser = await User.create(
        {
          restaurantId: createdRestaurant.id,
          firstName: owner.firstName,
          lastName: owner.lastName,
          email: owner.email,
          password: hashedPassword,
          phone: owner.phone,
          provider: "LOCAL",
        },
        { transaction }
      );
      console.log("✅ User created:", createdUser.id);

      // Create Default Roles
      await roleService.createDefaultRoles(
        createdRestaurant.id,
        transaction
      );
      console.log("✅ Default roles created");

      // Get OWNER Role
      const ownerRole = await roleService.getRoleByName(
        createdRestaurant.id,
        "OWNER",
        transaction
      );
      console.log("✅ Owner role retrieved");

      // Assign OWNER Role
      await UserRole.create(
        {
          userId: createdUser.id,
          roleId: ownerRole.id,
        },
        { transaction }
      );
      console.log("✅ Owner role assigned");

      // Generate JWT
      const token = generateToken({
        userId: createdUser.id,
        restaurantId: createdRestaurant.id,
      });
      console.log("✅ JWT generated");

      // Commit Transaction
      await transaction.commit();
      console.log("✅ Transaction committed");

      // Remove Password
      const user = createdUser.toJSON();
      delete user.password;

      console.log("========== REGISTRATION SUCCESS ==========\n");

      return {
        message: "Restaurant and Owner created successfully.",
        token,
        restaurant: createdRestaurant,
        user,
      };
    } catch (error) {
      console.log("❌ REGISTRATION FAILED:", error.message);
      console.log("========== REGISTRATION ROLLBACK ==========\n");
      await transaction.rollback();
      throw error;
    }
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