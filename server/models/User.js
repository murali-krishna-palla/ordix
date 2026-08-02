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
            field: "restaurant_id",
            allowNull: true, // SUPER_ADMIN users are not tied to a restaurant
        },

        // Distinguishes platform-level Super Admin accounts
        userType: {
            type: DataTypes.ENUM("RESTAURANT_USER", "SUPER_ADMIN"),
            allowNull: false,
            defaultValue: "RESTAURANT_USER",
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
            allowNull: true, // Allows Google-authenticated users
        },

        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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

        // Password Reset
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        resetPasswordExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        // Login Status
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "last_login",
        },

        // Employee Details
        employeeCode: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            field: "employee_code",
        },

        profileImage: {
            type: DataTypes.STRING,
            allowNull: true,
            field: "profile_image",
        },

        department: {
            type: DataTypes.ENUM(
                "MANAGEMENT",
                "KITCHEN",
                "SERVICE",
                "DELIVERY",
                "RECEPTION",
                "ACCOUNTS",
                "OTHER"
            ),
            allowNull: true,
        },

        designation: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        employmentType: {
            type: DataTypes.ENUM(
                "FULL_TIME",
                "PART_TIME",
                "CONTRACT",
                "INTERN"
            ),
            allowNull: false,
            defaultValue: "FULL_TIME",
            field: "employment_type",
        },

        shift: {
            type: DataTypes.ENUM(
                "MORNING",
                "AFTERNOON",
                "EVENING",
                "NIGHT"
            ),
            allowNull: true,
        },

        gender: {
            type: DataTypes.ENUM(
                "MALE",
                "FEMALE",
                "OTHER"
            ),
            allowNull: true,
        },

        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: "date_of_birth",
        },

        joiningDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            field: "joining_date",
        },

        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        employeeStatus: {
            type: DataTypes.ENUM(
                "ACTIVE",
                "INACTIVE",
                "SUSPENDED"
            ),
            allowNull: false,
            defaultValue: "ACTIVE",
            field: "employee_status",
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