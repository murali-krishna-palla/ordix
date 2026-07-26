const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        restaurantId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: true, // Allows Google-authenticated users if needed in the future
        },

        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },

        provider: {
            type: DataTypes.ENUM("LOCAL", "GOOGLE"),
            allowNull: false,
            defaultValue: "LOCAL",
        },

        // Password Reset Fields
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        resetPasswordExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "users",
        timestamps: true,
        paranoid: true,
        underscored: true,
    }
);

module.exports = User;