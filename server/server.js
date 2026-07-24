require("dotenv").config();

const app = require("./app");

const sequelize = require("./config/database");
const seedPermissions = require("./seeders/permissionSeeder");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Database Connection
    await sequelize.authenticate();
    console.log("✅ Database Connected");

    // Sync Database
    await sequelize.sync({ alter: true });
    console.log("✅ Database Synced");

    // Seed Permissions
    await seedPermissions();

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