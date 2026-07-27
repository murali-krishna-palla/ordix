export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const TOKEN_KEY = "ordix_token";

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  DASHBOARD: "/dashboard",
};
