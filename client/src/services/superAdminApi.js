import axios from "axios";
import { API_BASE_URL, SUPER_ADMIN_TOKEN_KEY } from "../constants";

const superAdminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

superAdminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(SUPER_ADMIN_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

superAdminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      "Something went wrong. Please try again.";

    const code = error.response?.data?.code;

    return Promise.reject({
      ...error,
      message,
      code,
      status: error.response?.status,
    });
  }
);

export default superAdminApi;
