import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import SuperAdminLayout from "../layouts/SuperAdminLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import GoogleCallback from "../pages/auth/GoogleCallback";

import Dashboard from "../pages/dashboard/Dashboard";
import HotelOverview from "../pages/hotel/HotelOverview";
import Staff from "../pages/staff/Staff";
import Customers from "../pages/customers/Customers";
import Settings from "../pages/settings/Settings";
import NotFound from "../pages/misc/NotFound";

import SuperAdminLogin from "../pages/super-admin/Login";
import SuperAdminDashboard from "../pages/super-admin/Dashboard";
import RegistrationRequests from "../pages/super-admin/RegistrationRequests";
import RequestDetails from "../pages/super-admin/RequestDetails";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import SuperAdminProtectedRoute from "./SuperAdminProtectedRoute";
import { SuperAdminAuthProvider } from "../context/SuperAdminAuthContext";

// Scopes the Super Admin session (its own token/context) to just the
// /super-admin/* subtree, so it never interferes with the restaurant
// AuthProvider that wraps the rest of the app.
const SuperAdminScope = () => (
  <SuperAdminAuthProvider>
    <Outlet />
  </SuperAdminAuthProvider>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      {/* Public-only routes (auth pages) */}
      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Protected routes (require auth) */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/hotel" element={<HotelOverview />} />
        <Route path="/dashboard/staff" element={<Staff />} />
        <Route path="/dashboard/customers" element={<Customers />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Route>

      {/* Super Admin console — fully separate session, layout, and guard. */}
      <Route path="/super-admin" element={<SuperAdminScope />}>
        <Route path="login" element={<SuperAdminLogin />} />

        <Route
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminLayout />
            </SuperAdminProtectedRoute>
          }
        >
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="registration-requests" element={<RegistrationRequests />} />
          <Route path="registration-requests/:id" element={<RequestDetails />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
