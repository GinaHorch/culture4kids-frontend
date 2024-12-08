import { createContext, useState } from "react";

// Here we create the Context
export const AuthContext = createContext();

// Here we create the component that will wrap our app, this means all it children can access the context using are hook.
export const AuthProvider = ({ children }) => {
  // Using a object for the state here, this way we can add more properties to the state later on like user id.
  const [auth, setAuth] = useState({
    token: window.localStorage.getItem("token") || null,
    user: null,  // Placeholder for user info
    role: null,  // Placeholder for user role
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};