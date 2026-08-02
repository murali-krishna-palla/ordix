import { createContext, useEffect, useState } from "react";
import authService from "../services/auth.service";
import { TOKEN_KEY } from "../constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists, hydrate the user from /auth/me.
  useEffect(() => {
    const hydrate = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await authService.getMe();
        setUser(me);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistSession = (userData, jwtToken) => {
    localStorage.setItem(TOKEN_KEY, jwtToken);
    setUser(userData);
    setToken(jwtToken);
  };

  const login = async (credentials) => {
    const result = await authService.login(credentials);
    persistSession(result.user, result.token);
    return result;
  };

  const registerOwner = async (payload) => {
    const result = await authService.registerOwner(payload);
    return result;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the API call fails, clear the local session.
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        registerOwner,
        logout,
        setSession: persistSession,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
