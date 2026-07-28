require("dotenv").config();

const app = require("./app");

const sequelize = require("./config/database");
const seedPermissions = require("./seeders/permissionSeeder");
const seedSuperAdmin = require("./seeders/superAdminSeeder");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Database Connection
    await sequelize.authenticate();
    console.log("✅ Database Connected");

    // Ensure restaurant_id can be null for platform-level super admins
    try {
      await sequelize.query('ALTER TABLE "users" ALTER COLUMN restaurant_id DROP NOT NULL;');
      console.log('✅ users.restaurant_id is nullable');
    } catch (schemaError) {
      console.warn('⚠️ Could not alter users.restaurant_id:', schemaError.message);
    }

    // Sync Database
    await sequelize.sync({ alter: true });
    console.log("✅ Database Synced");

    // Seed Permissions
    await seedPermissions();

    // Seed Super Admin
    await seedSuperAdmin();

    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server Startup Failed");
    console.error(error);
    process.exit(1);
  }
};

startServer();