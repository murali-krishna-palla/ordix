import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FiLoader } from "react-icons/fi";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <FiLoader className="animate-spin text-muted" size={22} />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
