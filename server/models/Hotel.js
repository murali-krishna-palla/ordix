const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Hotel = sequelize.define(
  "Hotel",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "owner_id",
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brandName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "brand_name",
    },

    description: {
      type: DataTypes.TEXT,
    },

    logo: {
      type: DataTypes.STRING,
    },

    banner: {
      type: DataTypes.STRING,
    },

    email: {
      type: DataTypes.STRING,
    },

    phone: {
      type: DataTypes.STRING,
    },

    website: {
      type: DataTypes.STRING,
    },

    gstNumber: {
      type: DataTypes.STRING,
      field: "gst_number",
    },

    fssaiNumber: {
      type: DataTypes.STRING,
      field: "fssai_number",
    },

    country: {
      type: DataTypes.STRING,
    },

    state: {
      type: DataTypes.STRING,
    },

    city: {
      type: DataTypes.STRING,
    },

    area: {
      type: DataTypes.STRING,
    },

    street: {
      type: DataTypes.STRING,
    },

    zipCode: {
      type: DataTypes.STRING,
      field: "zip_code",
    },

    currency: {
      type: DataTypes.STRING,
      defaultValue: "INR",
    },

    timezone: {
      type: DataTypes.STRING,
      defaultValue: "Asia/Kolkata",
    },

    taxPercentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      field: "tax_percentage",
    },

    serviceCharge: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      field: "service_charge",
    },

    language: {
      type: DataTypes.STRING,
      defaultValue: "English",
    },

    status: {
      type: DataTypes.ENUM(
        "ACTIVE",
        "TEMPORARILY_CLOSED",
        "PERMANENTLY_CLOSED"
      ),
      defaultValue: "ACTIVE",
    },
  },
  {
    tableName: "hotels",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Hotel;