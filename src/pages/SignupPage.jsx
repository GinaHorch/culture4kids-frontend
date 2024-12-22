import React from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "../components/SignupForm";
import { useAuth } from "../hooks/use-auth.js";
import "./SignupPage.css";

function SignupPage() {
  console.log("SignupPage rendered");
  const { auth } = useAuth();
  const navigate = useNavigate();

  if (auth?.token) {
    return (
      <div className="signup-page">
        <h2>You are already logged in!</h2>
        <p>Log out if you wish to create a new account. Otherwise, explore the site!</p>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <SignupForm />
      <p>
        Already have an account?{" "}
        <button onClick={() => navigate("/login")}>Login here</button>
      </p>
    </div>
  );
}

export default SignupPage;
