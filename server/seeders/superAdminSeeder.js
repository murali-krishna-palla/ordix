const { User } = require("../models");
const { hashPassword } = require("../utils/password");

const seedSuperAdmin = async () => {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log(
      "⚠️  SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD not set - skipping Super Admin seeding."
    );
    return;
  }

  const existingSuperAdmin = await User.findOne({
    where: { userType: "SUPER_ADMIN" },
  });

  if (existingSuperAdmin) {
    console.log("✅ Super Admin already exists");
    return;
  }

  const hashedPassword = await hashPassword(password);

  await User.create({
    restaurantId: null,
    firstName: process.env.SUPER_ADMIN_FIRST_NAME || "Super",
    lastName: process.env.SUPER_ADMIN_LAST_NAME || "Admin",
    email,
    password: hashedPassword,
    phone: process.env.SUPER_ADMIN_PHONE || "0000000000",
    provider: "LOCAL",
    userType: "SUPER_ADMIN",
    isActive: true,
  });

  console.log("✅ Super Admin Seeded:", email);
};

module.exports = seedSuperAdmin;
