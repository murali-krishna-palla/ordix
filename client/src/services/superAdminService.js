import api from "./api";
import superAdminApi from "./superAdminApi";

// Session management for the Super Admin console (/super-admin/*). Kept
// separate from auth.service.js because Super Admins and Restaurant Admins
// are different principals with different tokens (see SUPER_ADMIN_TOKEN_KEY).
const superAdminService = {
  superAdminLogin: async ({ email, password }) => {
    const { data } = await superAdminApi.post("/auth/super-admin/login", {
      email,
      password,
    });

    const token = data.data?.token;
    const admin = data.data?.admin || data.data?.user;
    return { token, admin };
  },

  getMe: async () => {
    const { data } = await superAdminApi.get("/auth/super-admin/me");
    return data.data; // admin
  },

  logout: async () => {
    const { data } = await superAdminApi.post("/auth/super-admin/logout");
    return data;
  },
};

export default superAdminService;
