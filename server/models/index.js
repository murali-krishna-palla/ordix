const sequelize = require("../config/database");

const Restaurant = require("./Restaurant");
const User = require("./User");
const Role = require("./Role");
const Permission = require("./Permission");
const UserRole = require("./UserRole");
const RolePermission = require("./RolePermission");

/* =====================================================
   Restaurant <-> User
===================================================== */

Restaurant.hasMany(User, {
  foreignKey: "restaurantId",
  as: "users",
});

User.belongsTo(Restaurant, {
  foreignKey: "restaurantId",
  as: "restaurant",
});

/* =====================================================
   Restaurant <-> Role
===================================================== */

Restaurant.hasMany(Role, {
  foreignKey: "restaurantId",
  as: "roles",
});

Role.belongsTo(Restaurant, {
  foreignKey: "restaurantId",
  as: "restaurant",
});

/* =====================================================
   User <-> Role (Many-to-Many)
===================================================== */

User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "userId",
  otherKey: "roleId",
  as: "roles",
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "roleId",
  otherKey: "userId",
  as: "users",
});

/* =====================================================
   Role <-> Permission (Many-to-Many)
===================================================== */

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions",
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

module.exports = {
  sequelize,
  Restaurant,
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
};