import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider";

export const useAuth = () => {
  // This hook retrieves the context values (auth, setAuth, login, logout) from AuthProvider.
  const context = useContext(AuthContext);

  console.log("Returning auth state and functions from useAuth:", context);

  if (!context || typeof context.login !== "function" || typeof context.signup !== "function") {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context; // Includes auth, login, logout, and signup
};