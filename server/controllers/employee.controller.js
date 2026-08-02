const employeeService = require("../services/employee.service");

class EmployeeController {

    async createEmployee(req, res, next) {
        try {

            const employee = await employeeService.createEmployee({
                ...req.body,
                restaurantId: req.user.restaurantId,
            });

            return res.status(201).json({
                success: true,
                message: "Employee created successfully.",
                data: employee,
            });

        } catch (error) {
            next(error);
        }
    }

    async getEmployees(req, res, next) {
        try {

            const employees = await employeeService.getEmployees(
                req.user.restaurantId,
                req.query
            );

            return res.status(200).json({
                success: true,
                message: "Employees fetched successfully.",
                data: employees,
            });

        } catch (error) {
            next(error);
        }
    }

    async getEmployeeById(req, res, next) {
        try {

            const employee =
                await employeeService.getEmployeeById(req.params.id);

            return res.status(200).json({
                success: true,
                message: "Employee fetched successfully.",
                data: employee,
            });

        } catch (error) {
            next(error);
        }
    }

    async updateEmployee(req, res, next) {
        try {

            const employee =
                await employeeService.updateEmployee(
                    req.params.id,
                    req.body
                );

            return res.status(200).json({
                success: true,
                message: "Employee updated successfully.",
                data: employee,
            });

        } catch (error) {
            next(error);
        }
    }

    async changeEmployeeRole(req, res, next) {
        try {

            const employee =
                await employeeService.changeEmployeeRole(
                    req.params.id,
                    req.body.roleId
                );

            return res.status(200).json({
                success: true,
                message: "Employee role updated successfully.",
                data: employee,
            });

        } catch (error) {
            next(error);
        }
    }

    async updateEmployeeStatus(req, res, next) {
        try {

            const employee =
                await employeeService.updateEmployeeStatus(
                    req.params.id,
                    req.body.employeeStatus
                );

            return res.status(200).json({
                success: true,
                message: "Employee status updated successfully.",
                data: employee,
            });

        } catch (error) {
            next(error);
        }
    }

    async deleteEmployee(req, res, next) {
        try {

            await employeeService.deleteEmployee(req.params.id);

            return res.status(200).json({
                success: true,
                message: "Employee deleted successfully.",
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new EmployeeController();