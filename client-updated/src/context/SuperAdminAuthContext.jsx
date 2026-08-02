import { createContext, useEffect, useState } from "react";
import superAdminService from "../services/superAdminService";
import { SUPER_ADMIN_TOKEN_KEY } from "../constants";

// Mirrors AuthContext.jsx, but scoped to the Super Admin console so a
// restaurant session and a super admin session can coexist independently.
const SuperAdminAuthContext = createContext();

export const SuperAdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem(SUPER_ADMIN_TOKEN_KEY) || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await superAdminService.getMe();
        setAdmin(me);
      } catch (error) {
        localStorage.removeItem(SUPER_ADMIN_TOKEN_KEY);
        setToken(null);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const persistSession = (adminData, jwtToken) => {
    localStorage.setItem(SUPER_ADMIN_TOKEN_KEY, jwtToken);
    setAdmin(adminData);
    setToken(jwtToken);
  };

  const login = async (credentials) => {
    const result = await superAdminService.superAdminLogin(credentials);
    persistSession(result.admin, result.token);
    return result;
  };

  const logout = async () => {
    try {
      await superAdminService.logout();
    } catch {
      // Even if the API call fails, clear the local session.
    } finally {
      localStorage.removeItem(SUPER_ADMIN_TOKEN_KEY);
      setAdmin(null);
      setToken(null);
    }
  };

  return (
    <SuperAdminAuthContext.Provider
      value={{
        admin,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </SuperAdminAuthContext.Provider>
  );
};

export default SuperAdminAuthContext;
