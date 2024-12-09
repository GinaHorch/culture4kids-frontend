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

  console.log("AuthProvider initialized:", auth);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children || null}
    </AuthContext.Provider>
  );
};