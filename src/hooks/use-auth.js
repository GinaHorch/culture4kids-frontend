import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider";

export const useAuth = () => {
  // We pass in the context and create a custom hook that returns the context auth and setAuth
  const { auth, setAuth } = useContext(AuthContext);
  
  if (!auth || typeof setAuth !== "function") {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const login = async ({ username, password }) => {
    try {
      console.log("Attempting login with:", { username, password });
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api-token-auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("Login response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Invalid username or password";
        try {
          const data = await response.json();
          console.log("API response data:", data);
          errorMessage = data.detail || errorMessage;
        } catch {
          // Fallback to default message if response.json() fails
          console.error("Failed to parse error response");
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Successful login response data:", data);

      if (!data.token || !data.user) {
        throw new Error("Invalid response from the server");
      }

      setAuth({ token: data.token, user: data.user, role: data.user.role });
      console.log("Auth context updated:", { token: data.token, user: data.user, role: data.user.role });
      
      window.localStorage.setItem("token", data.token);
      window.localStorage.setItem("user", JSON.stringify(data.user)); // Store user details in localStorage
      console.log("User stored in localStorage:", data.user);

    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

// Logout function
const logout = () => {
  console.log("User logging out");
  setAuth({ token: null, user: null, role: null });
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user"); // Remove user details
  console.log("Auth and user data cleared from localStorage");
}; 
console.log("Returning auth state and functions from useAuth:", { auth });

return { auth, login, logout };
};