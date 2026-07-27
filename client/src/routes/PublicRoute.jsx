import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FiLoader } from "react-icons/fi";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <FiLoader className="animate-spin text-muted" size={22} />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
