import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm"; // Your existing LoginForm
import { useAuth } from "../hooks/use-auth.js"; // Hook to check login state
import "./LoginPage.css"; // Custom styling for login/signup forms
import "../components/SignupForm.css"; // Reuse SignupForm styling
import SignupForm from "../components/SignupForm";

function LoginPage() {
  console.log("LoginPage rendered");
  
  const { auth, logout } = useAuth(); // Check if the user is logged in
  const [isLoginForm, setIsLoginForm] = useState(true); // Toggle between login/signup forms
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.localStorage.removeItem("token");
  };

  // **Keep conditional rendering for "logged-in" and "login form" views**
  if (auth?.token) {
    return (
      <div className="login-page">
        <div className="login-container">
          <h2 className="welcome-text">Welcome back!</h2>
          <p className="info-text">
            You are already logged in.
          </p>
          <button onClick={() => navigate("/")} className="login-button">
            Go Home
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    );
  }

    // Login form view updated to match SignupPage styling
    return (
    <div className="login-page">
      <div className="login-container">
      {isLoginForm ? (
          <div>
            <h1>Login</h1>
            <LoginForm />
          </div>
        ) : (
          <div className="signup-form">
            <h1>Sign Up</h1>
            <SignupForm />
          </div>
        )}
        <p>
          {isLoginForm ? "Don't have an account?" : 'Already have an account?'}
          <button
            className="toggle-form-button"
            onClick={() => setIsLoginForm(!isLoginForm)}
          >
            {isLoginForm ? 'Sign up here' : 'Login here'}
          </button>
        </p>
    </div>
  </div>
  );
}

export default LoginPage;