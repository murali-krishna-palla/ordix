import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

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
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    brandName: {
      type: DataTypes.STRING,
      allowNull: true,
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
    },

    fssaiNumber: {
      type: DataTypes.STRING,
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
    },

    serviceCharge: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
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
  }
);

export default Hotel;