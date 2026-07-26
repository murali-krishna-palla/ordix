import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setUser({});
    }
    setLoading(false);
  }, [token]);

  const login = (userData, jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setUser(userData);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;