import { Navigate } from "react-router-dom";
import useSuperAdminAuth from "../hooks/useSuperAdminAuth";
import { FiLoader } from "react-icons/fi";

// Mirrors routes/ProtectedRoute.jsx. A Restaurant Admin token does not grant
// access here — only a Super Admin session (SUPER_ADMIN_TOKEN_KEY) does.
const SuperAdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSuperAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <FiLoader className="animate-spin text-muted" size={22} />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/super-admin/login" replace />;
};

export default SuperAdminProtectedRoute;
