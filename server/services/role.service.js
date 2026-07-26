const { Role } = require("../models");

class RoleService {
  // ==============================
  // Create Default Roles
  // ==============================
  async createDefaultRoles(restaurantId, transaction) {
    const roles = [
      {
        restaurantId,
        name: "OWNER",
        description: "Restaurant Owner",
        isDefault: false,
      },
      {
        restaurantId,
        name: "MANAGER",
        description: "Restaurant Manager",
        isDefault: true,
      },
      {
        restaurantId,
        name: "CHEF",
        description: "Kitchen Staff",
        isDefault: true,
      },
      {
        restaurantId,
        name: "WAITER",
        description: "Service Staff",
        isDefault: true,
      },
      {
        restaurantId,
        name: "CASHIER",
        description: "Billing Staff",
        isDefault: true,
      },
    ];

    const createdRoles = [];

    for (const role of roles) {
      const createdRole = await Role.create(role, {
        transaction,
      });

      createdRoles.push(createdRole);
    }

    return createdRoles;
  }

  // ==============================
  // Get Role By Name
  // ==============================
  async getRoleByName(restaurantId, roleName, transaction) {
    return await Role.findOne({
      where: {
        restaurantId,
        name: roleName,
      },
      transaction,
    });
  }
}

module.exports = new RoleService();