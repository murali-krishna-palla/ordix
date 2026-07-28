const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RestaurantRegistrationRequest = sequelize.define(
  "RestaurantRegistrationRequest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    restaurantName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "restaurant_name",
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },

    ownerName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "owner_name",
      validate: {
        notEmpty: true,
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 15],
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false, // Stored hashed - never keep this in plain text
    },

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
      },
    },

    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
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
      field: "postal_code",
    },

    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      allowNull: false,
      defaultValue: "PENDING",
    },

    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "rejection_reason",
    },

    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "approved_by",
      references: {
        model: "users",
        key: "id",
      },
    },

    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "approved_at",
    },
  },
  {
    tableName: "restaurant_registration_requests",
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

module.exports = RestaurantRegistrationRequest;
