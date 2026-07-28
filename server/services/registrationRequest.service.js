const {
  sequelize,
  Restaurant,
  User,
  UserRole,
  RestaurantRegistrationRequest,
} = require("../models");
const registrationRequestRepository = require("../repositories/registrationRequest.repository");
const roleService = require("./role.service");
const { hashPassword } = require("../utils/password");
const ApiError = require("../utils/ApiError");

// Splits a single "owner name" field into firstName/lastName so it can be
// mapped onto the existing User model, which stores the two separately.
const splitOwnerName = (ownerName) => {
  const parts = ownerName.trim().split(/\s+/);
  const firstName = parts.shift();
  const lastName = parts.length > 0 ? parts.join(" ") : firstName;

  return { firstName, lastName };
};

class RegistrationRequestService {
  // ==============================
  // Register Restaurant Request
  // ==============================
  async registerRequest(data) {
    const {
      restaurantName,
      ownerName,
      email,
      phone,
      password,
      address,
      city,
      state,
      country,
      postalCode,
    } = data;

    // Prevent duplicate email across existing (active) users
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    // Prevent duplicate email across pending requests
    const existingPending =
      await registrationRequestRepository.findPendingByEmail(email);

    if (existingPending) {
      throw new ApiError(
        409,
        "A registration request with this email is already pending approval."
      );
    }

    const hashedPassword = await hashPassword(password);

    const request = await registrationRequestRepository.createRequest({
      restaurantName,
      ownerName,
      email,
      phone,
      password: hashedPassword,
      address,
      city,
      state,
      country,
      postalCode,
    });

    const requestData = request.toJSON();
    delete requestData.password;

    return {
      message:
        "Registration request submitted successfully. Please wait for Super Admin approval.",
      request: requestData,
    };
  }

  // ==============================
  // Get Pending Requests
  // ==============================
  async getPendingRequests() {
    return await registrationRequestRepository.findAllPending();
  }

  // ==============================
  // Get All Requests (optionally filtered by status)
  // ==============================
  async getAllRequests(status) {
    const where = status ? { status } : {};
    return await registrationRequestRepository.findAll(where);
  }

  // ==============================
  // Get Request By Id
  // ==============================
  async getRequestById(id) {
    const request = await registrationRequestRepository.findById(id);

    if (!request) {
      throw new ApiError(404, "Registration request not found.");
    }

    return request;
  }

  // ==============================
  // Approve Request
  // ==============================
  async approveRequest(requestId, approvedByUserId) {
    const transaction = await sequelize.transaction();

    try {
      // Lock the row for the duration of the transaction to avoid a
      // double-approval race condition.
      const request = await RestaurantRegistrationRequest.findByPk(
        requestId,
        { transaction, lock: transaction.LOCK.UPDATE }
      );

      if (!request) {
        throw new ApiError(404, "Registration request not found.");
      }

      if (request.status !== "PENDING") {
        throw new ApiError(
          400,
          `This request has already been ${request.status.toLowerCase()}.`
        );
      }

      // Re-check email uniqueness at approval time in case it was taken
      // by another account between submission and approval.
      const existingUser = await User.findOne({
        where: { email: request.email },
        transaction,
      });

      if (existingUser) {
        throw new ApiError(
          409,
          "An account with this email already exists."
        );
      }

      // Create Restaurant
      const createdRestaurant = await Restaurant.create(
        {
          name: request.restaurantName,
          email: request.email,
          phone: request.phone,
          address: request.address,
          city: request.city,
          state: request.state,
          country: request.country,
        },
        { transaction }
      );

      // Create Default Roles (includes RESTAURANT_ADMIN)
      await roleService.createDefaultRoles(createdRestaurant.id, transaction);

      const restaurantAdminRole = await roleService.getRoleByName(
        createdRestaurant.id,
        "RESTAURANT_ADMIN",
        transaction
      );

      // Create Restaurant Admin User (password is already hashed)
      const { firstName, lastName } = splitOwnerName(request.ownerName);

      const createdUser = await User.create(
        {
          restaurantId: createdRestaurant.id,
          firstName,
          lastName,
          email: request.email,
          password: request.password,
          phone: request.phone,
          provider: "LOCAL",
          userType: "RESTAURANT_USER",
          isActive: true,
        },
        { transaction }
      );

      // Assign RESTAURANT_ADMIN Role
      await UserRole.create(
        {
          userId: createdUser.id,
          roleId: restaurantAdminRole.id,
        },
        { transaction }
      );

      // Update Request Status
      await request.update(
        {
          status: "APPROVED",
          approvedBy: approvedByUserId,
          approvedAt: new Date(),
        },
        { transaction }
      );

      await transaction.commit();

      const userData = createdUser.toJSON();
      delete userData.password;

      return {
        message: "Restaurant approved successfully.",
        restaurant: createdRestaurant,
        user: userData,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ==============================
  // Reject Request
  // ==============================
  async rejectRequest(requestId, rejectionReason) {
    const request = await registrationRequestRepository.findById(requestId);

    if (!request) {
      throw new ApiError(404, "Registration request not found.");
    }

    if (request.status !== "PENDING") {
      throw new ApiError(
        400,
        `This request has already been ${request.status.toLowerCase()}.`
      );
    }

    await registrationRequestRepository.updateStatus(requestId, {
      status: "REJECTED",
      rejectionReason: rejectionReason || null,
    });

    return {
      message: "Registration request rejected.",
    };
  }
}

module.exports = new RegistrationRequestService();
