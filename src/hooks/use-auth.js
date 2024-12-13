import { useContext, useState } from "react";
import { AuthContext } from "../components/AuthProvider";

export const useAuth = () => {
  // This hook retrieves the context values (auth, setAuth, login, logout) from AuthProvider.
  const context = useContext(AuthContext);

  console.log("Returning auth state and functions from useAuth:", context);

  if (!context || typeof context.login !== "function") {
    throw new Error("useAuth must be used within an AuthProvider");
  }

// `login` is now accessed directly from context.

// Logout is now accessed directly from context.

return context; // Return all context values (auth, login, logout)
};