import api from "./api";
import { API_BASE_URL } from "../constants";

const authService = {
  // Registers a new restaurant + its owner account in one call.
  registerOwner: async ({ restaurant, owner }) => {
    const { data } = await api.post("/auth/register-owner", {
      restaurant,
      owner,
    });
    return data.data; // registration request
  },

  login: async ({ email, password }) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });
    return data.data; // { token, user }
  },

  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data.data; // user
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    const { data } = await api.patch("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return data;
  },

  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  },

  forgotPassword: async ({ email }) => {
    const { data } = await api.post("/auth/forgot-password", {
      email,
    });
    return data;
  },

  resetPassword: async (token, { password }) => {
    const { data } = await api.post(`/auth/reset-password/${token}`, {
      password,
    });
    return data;
  },

  // Google OAuth is a full-page redirect, not an XHR call.
  googleLoginUrl: () => `${API_BASE_URL}/auth/google`,
};

export default authService;
