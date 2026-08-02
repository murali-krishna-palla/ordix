import api from "./api";

const employeeService = {
  getEmployees: async (params) => {
    const { data } = await api.get("/employees", { params });
    return data.data; // { count, rows }
  },

  getEmployeeById: async (id) => {
    const { data } = await api.get(`/employees/${id}`);
    return data.data; // employee
  },

  createEmployee: async (payload) => {
    const { data } = await api.post("/employees", payload);
    return data.data; // employee
  },

  updateEmployee: async (id, payload) => {
    const { data } = await api.put(`/employees/${id}`, payload);
    return data.data; // employee
  },

  changeEmployeeRole: async (id, roleId) => {
    const { data } = await api.patch(`/employees/${id}/role`, { roleId });
    return data.data; // employee
  },

  updateEmployeeStatus: async (id, employeeStatus) => {
    const { data } = await api.patch(`/employees/${id}/status`, {
      employeeStatus,
    });
    return data.data; // employee
  },

  deleteEmployee: async (id) => {
    await api.delete(`/employees/${id}`);
  },
};

export default employeeService;
