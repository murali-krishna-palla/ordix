const { Permission } = require("../models");

const permissions = [
  // Dashboard
  { name: "View Dashboard", module: "Dashboard" },

  // Orders
  { name: "Create Order", module: "Orders" },
  { name: "View Orders", module: "Orders" },
  { name: "Update Order", module: "Orders" },
  { name: "Delete Order", module: "Orders" },

  // Menu
  { name: "Create Menu", module: "Menu" },
  { name: "View Menu", module: "Menu" },
  { name: "Update Menu", module: "Menu" },
  { name: "Delete Menu", module: "Menu" },

  // Tables
  { name: "Manage Tables", module: "Tables" },

  // Staff
  { name: "Manage Staff", module: "Staff" },

  // Inventory
  { name: "Manage Inventory", module: "Inventory" },

  // Customers
  { name: "Manage Customers", module: "Customers" },

  // Payments
  { name: "Manage Payments", module: "Payments" },

  // Reports
  { name: "View Reports", module: "Reports" },
];

const seedPermissions = async () => {
  for (const permission of permissions) {
    await Permission.findOrCreate({
      where: { name: permission.name },
      defaults: permission,
    });
  }

  console.log("✅ Permissions Seeded");
};

module.exports = seedPermissions;