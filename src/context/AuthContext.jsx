import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const savedToken = localStorage.getItem("token");
  const savedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(
    savedUser
  );
  const [token, setToken] = useState(savedToken);

  const login = (data) => {
    const authUser = data?.user || data;
    const authToken = data?.token || null;

    setUser(authUser);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(authUser));
    if (authToken) {
      localStorage.setItem("token", authToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin: user?.role === "ADMIN",
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
