export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// The API root without the "/api/v1" suffix — used to resolve static
// asset paths like uploaded logos/banners that the server serves from "/uploads".
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export const TOKEN_KEY = "ordix_token";

// Kept separate from TOKEN_KEY so a Super Admin session never collides
// with (or gets overwritten by) a Restaurant Admin session in the same browser.
export const SUPER_ADMIN_TOKEN_KEY = "ordix_super_admin_token";

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  DASHBOARD: "/dashboard",
  SETTINGS: "/dashboard/settings",
  SUPER_ADMIN_LOGIN: "/super-admin/login",
  SUPER_ADMIN_DASHBOARD: "/super-admin/dashboard",
  SUPER_ADMIN_REGISTRATION_REQUESTS: "/super-admin/registration-requests",
};

// Mirrors the status values the registration-approval API returns for a
// restaurant's registration request.
export const REGISTRATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

// Mirrors server/models/Restaurant.js currency/timezone/language defaults
// plus common alternatives, so Settings selects have sane, bounded options.
export const CURRENCY_OPTIONS = ["INR", "USD", "EUR", "GBP", "AED"];

export const LANGUAGE_OPTIONS = ["English", "Hindi", "Telugu", "Tamil", "Kannada"];

export const TIMEZONE_OPTIONS = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Europe/London",
  "America/New_York",
];
