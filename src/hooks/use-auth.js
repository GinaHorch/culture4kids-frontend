import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider";

export const useAuth = () => {
  // We pass in the context and create a custom hook that returns the context auth and setAuth
  const { auth, setAuth } = useContext(AuthContext);
  
  if (!auth || !setAuth) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const login = async ({ username, password }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api-token-auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        let errorMessage = "Invalid username or password";
        try {
          const data = await response.json();
          errorMessage = data.detail || errorMessage;
        } catch {
          // Fallback to default message if response.json() fails
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data.token || !data.user) {
        throw new Error("Invalid response from the server");
      }

      setAuth({ token: data.token, user: data.user });
      console.log("Auth context updated:", { token: data.token, user: data.user });
      window.localStorage.setItem("token", data.token);
      window.localStorage.setItem("user", JSON.stringify(data.user)); // Store user details in localStorage
      console.log("User stored in localStorage:", data.user);
    } catch (error) {
      throw error;
    }
  };

// Logout function
const logout = () => {
  setAuth({ token: null, user: null });
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user"); // Remove user details
}; 

return { auth, login, logout };
};