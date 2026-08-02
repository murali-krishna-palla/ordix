const bcrypt = require("bcrypt");
const sequelize = require("../config/database");

const employeeRepository = require("../repositories/employee.repository");

class EmployeeService {
    generateEmployeeCode() {
        return `EMP-${Date.now()}`;
    }

    async createEmployee(data) {
        const transaction = await sequelize.transaction();

        try {
            const {
                roleId,
                password,
                email,
                phone,
                ...employeeData
            } = data;

            const existingEmail =
                await employeeRepository.findByEmail(email);

            if (existingEmail) {
                throw new Error("Email already exists.");
            }

            const existingPhone =
                await employeeRepository.findByPhone(phone);

            if (existingPhone) {
                throw new Error("Phone number already exists.");
            }

            const role =
                await employeeRepository.findRoleById(roleId);

            if (!role) {
                throw new Error("Invalid role.");
            }

            const hashedPassword =
                await bcrypt.hash(password, 10);

            const employee =
                await employeeRepository.createEmployee(
                    {
                        ...employeeData,
                        email,
                        phone,
                        password: hashedPassword,
                        employeeCode: this.generateEmployeeCode(),
                    },
                    transaction
                );

            await employeeRepository.assignRole(
                employee.id,
                role.id,
                transaction
            );

            await transaction.commit();

            return await employeeRepository.findEmployeeById(employee.id);

        } catch (error) {

            console.error("Create Employee Error:", error);

            if (transaction && !transaction.finished) {
                await transaction.rollback();
            }

            throw error;
        }
    }

    async getEmployees(restaurantId, filters) {
        return await employeeRepository.getEmployees(
            restaurantId,
            filters
        );
    }

    async getEmployeeById(id) {
        const employee =
            await employeeRepository.findEmployeeById(id);

        if (!employee) {
            throw new Error("Employee not found.");
        }

        return employee;
    }

    async updateEmployee(id, data) {

        const employee =
            await employeeRepository.findEmployeeById(id);

        if (!employee) {
            throw new Error("Employee not found.");
        }

        if (data.email) {
            const existingEmail =
                await employeeRepository.findByEmail(data.email);

            if (existingEmail && existingEmail.id !== id) {
                throw new Error("Email already exists.");
            }
        }

       if (data.phone) {
    const existingPhone =
        await employeeRepository.findByPhone(data.phone);

    console.log("=================================");
    console.log("Updating Employee ID :", id);
    console.log("Existing Phone ID    :", existingPhone?.id);
    console.log("Phone                :", data.phone);
    console.log("=================================");

    if (existingPhone && existingPhone.id !== id) {
        throw new Error("Phone number already exists.");
    }
}

        return await employeeRepository.updateEmployee(id, data);
    }

    async changeEmployeeRole(userId, roleId) {
        const employee =
            await employeeRepository.findEmployeeById(userId);

        if (!employee) {
            throw new Error("Employee not found.");
        }

        const role =
            await employeeRepository.findRoleById(roleId);

        if (!role) {
            throw new Error("Role not found.");
        }

        const transaction = await sequelize.transaction();

        try {
            await employeeRepository.updateEmployeeRole(
                userId,
                roleId,
                transaction
            );

            await transaction.commit();

            return await employeeRepository.findEmployeeById(userId);

        } catch (error) {

            console.error("Change Employee Role Error:", error);

            if (transaction && !transaction.finished) {
                await transaction.rollback();
            }

            throw error;
        }
    }

    async updateEmployeeStatus(id, employeeStatus) {
        return await employeeRepository.updateEmployee(id, {
            employeeStatus,
        });
    }

    async deleteEmployee(id) {
        const employee =
            await employeeRepository.findEmployeeById(id);

        if (!employee) {
            throw new Error("Employee not found.");
        }

        await employeeRepository.deleteEmployee(id);

        return;
    }
}

module.exports = new EmployeeService();