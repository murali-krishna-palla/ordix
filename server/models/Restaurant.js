const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Restaurant = sequelize.define(
  "Restaurant",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // ==========================
    // Basic Information
    // ==========================

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [10, 15],
      },
    },

    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },

    // ==========================
    // Branding
    // ==========================

    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    banner: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // ==========================
    // Legal Information
    // ==========================

    gstNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    fssaiNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // ==========================
    // Address
    // ==========================

    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },

    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },

    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "India",
    },

    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // ==========================
    // Business Settings
    // ==========================

    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Asia/Kolkata",
    },

    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "INR",
    },

    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "English",
    },

    taxPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },

    serviceCharge: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },

    // ==========================
    // Social Media
    // ==========================

    facebook: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    instagram: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    twitter: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // ==========================
    // Subscription
    // ==========================

    subscriptionPlan: {
      type: DataTypes.ENUM("FREE", "PRO", "ENTERPRISE"),
      allowNull: false,
      defaultValue: "FREE",
    },

    // ==========================
    // Restaurant Status
    // ==========================

    status: {
      type: DataTypes.ENUM(
        "ACTIVE",
        "TEMPORARILY_CLOSED",
        "PERMANENTLY_CLOSED"
      ),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
  },
  {
    tableName: "restaurants",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

module.exports = Restaurant;