import { createContext, useState } from "react";

// Here we create the Context
export const AuthContext = createContext();

// Here we create the component that will wrap our app, this means all it children can access the context using are hook.
export const AuthProvider = ({ children }) => {
  
  const [auth, setAuth] = useState({
    token: window.localStorage.getItem("token") || null,
    user: JSON.parse(window.localStorage.getItem("user")) || null,
    role: JSON.parse(window.localStorage.getItem("user"))?.role || null,
  });

  console.log("AuthContext.Provider initialized with:", { auth });

  const login = async ({ username, password }) => {
    try {
      console.log("Attempting login with:", { username, password });
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api-token-auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      setAuth({ token: data.token, user: data.user, role: data.user.role });
      window.localStorage.setItem("token", data.token);
      window.localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const logout = () => {
    setAuth({ token: null, user: null, role: null });
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {console.log("AuthProvider initialized with value:", { auth, setAuth, login, logout })}
      {children || null}
    </AuthContext.Provider>
  );
};