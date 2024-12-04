import React, { useState } from "react";
import LoginForm from "../components/LoginForm"; // Your existing LoginForm
import { useAuth } from "../hooks/use-auth.js"; // Hook to check login state
import "./LoginPage.css"; // Custom styling for login/signup forms

function LoginPage() {
  const { auth, setAuth } = useAuth(); // Check if the user is logged in
  const [isLoginForm, setIsLoginForm] = useState(true); // Toggle between login/signup forms

  const handleLogout = () => {
    setAuth(null);
    window.localStorage.removeItem("token");
  };

  return (
    <div className="login-page">
      {auth?.token ? ( // Show logout if logged in
        <div className="logout-container">
          <h2>Welcome back!</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="auth-container">
          <h2>{isLoginForm ? "Login" : "Sign Up"}</h2>
          {isLoginForm ? (
            <LoginForm />
          ) : (
            <p>
              Signup functionality not yet implemented! Please add the
              `SignupForm` component.
            </p>
          )}
          <p>
            {isLoginForm ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="toggle-form-btn"
              onClick={() => setIsLoginForm(!isLoginForm)}
            >
              {isLoginForm ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default LoginPage;