import axios from "axios";
import { API_BASE_URL, TOKEN_KEY } from "../constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the auth token to every outgoing request, if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize backend error shape so callers can rely on `error.message`.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      "Something went wrong. Please try again.";

    return Promise.reject({
      ...error,
      message,
      status: error.response?.status,
    });
  }
);

export default api;
