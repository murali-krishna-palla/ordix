const User = require("../models/User");
const Role = require("../models/Role");
const UserRole = require("../models/UserRole");
const { Op } = require("sequelize");

class EmployeeRepository {

    async createEmployee(userData, transaction = null) {
        return await User.create(userData, { transaction });
    }

    async assignRole(userId, roleId, transaction = null) {
        return await UserRole.create(
            {
                userId,
                roleId,
            },
            { transaction }
        );
    }

    async findByEmail(email) {
        return await User.findOne({
            where: { email },
        });
    }

    async findByPhone(phone) {
        return await User.findOne({
            where: { phone },
        });
    }

    async findByEmployeeCode(employeeCode) {
        return await User.findOne({
            where: { employeeCode },
        });
    }

    async findRoleById(roleId) {
        return await Role.findByPk(roleId);
    }

    async findEmployeeById(id) {
        return await User.findByPk(id, {
            include: [
                {
                    model: Role,
                    as: "roles",
                    through: {
                        attributes: [],
                    },
                },
            ],
        });
    }

    async getEmployees(restaurantId, filters = {}) {

        const {
            page = 1,
            limit = 10,
            search,
            department,
            employeeStatus,
        } = filters;

        const where = {
            restaurantId,
            userType: "RESTAURANT_USER",
        };

        if (department) {
            where.department = department;
        }

        if (employeeStatus) {
            where.employeeStatus = employeeStatus;
        }

        if (search) {
            where[Op.or] = [
                {
                    firstName: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
                {
                    lastName: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
                {
                    email: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
                {
                    phone: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
                {
                    employeeCode: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
            ];
        }

        return await User.findAndCountAll({
            where,

            include: [
                {
                    model: Role,
                    as: "roles",
                    where: {
                        name: {
                            [Op.ne]: "RESTAURANT_ADMIN",
                        },
                    },
                    through: {
                        attributes: [],
                    },
                },
            ],

            limit: Number(limit),
            offset: (page - 1) * Number(limit),

            order: [["createdAt", "DESC"]],
        });
    }

    async updateEmployee(id, data) {

        await User.update(data, {
            where: { id },
        });

        return await this.findEmployeeById(id);
    }

    async updateEmployeeRole(userId, roleId, transaction = null) {

        await UserRole.destroy({
            where: { userId },
            transaction,
        });

        return await UserRole.create(
            {
                userId,
                roleId,
            },
            { transaction }
        );
    }

    async deleteEmployee(id) {
        return await User.destroy({
            where: { id },
        });
    }
}

module.exports = new EmployeeRepository();