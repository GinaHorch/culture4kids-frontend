import { createContext, useCallback, useMemo, useState } from "react";

// Here we create the Context
export const AuthContext = createContext();

// Here we create the component that will wrap our app, this means all it children can access the context using are hook.
export const AuthProvider = ({ children }) => {
   // Updated auth state initialisation with validation for localStorage data
   const [auth, setAuth] = useState(() => {
    const token = window.localStorage.getItem("token");
    const user = window.localStorage.getItem("user");
    try {
      const parsedUser = user ? JSON.parse(user) : null;
      return {
        token: token || null,
        user: parsedUser,
        role: parsedUser?.role || null,
      };
    } catch {
      console.error("Error parsing user data from localStorage");
      return { token: null, user: null, role: null };
    }
  });

  console.log("AuthContext.Provider initialized with:", { auth });

  const login = async ({ username, password }) => {
    try {
      console.log("Attempting login with:", { username, password });
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api-token-auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
      });

      console.log("Login response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Invalid username or password";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch {
          console.error("Failed to parse error response");
        }
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      setAuth({ token: data.token, user: data.user, role: data.user.role });
      window.localStorage.setItem("token", data.token);
      window.localStorage.setItem("user", JSON.stringify(data.user));

      console.log("User logged in successfully:", data.user)
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  const logout = useCallback(() => {
    setAuth({ token: null, user: null, role: null });
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    console.log("User logged out.");
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ auth, login, logout }), [auth, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {console.log("AuthProvider initialised with value:", contextValue)}
      {children || null}
    </AuthContext.Provider>
  );
};