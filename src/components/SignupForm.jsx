import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import z from "zod";
import postSignup from "../api/post-signup.js";

// Schema validation for signup
const signupSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
    role: z.enum(["user", "organisation"], { message: "Role is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

function SignupForm() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
  });
  const [errors, setErrors] = useState({}); // For displaying validation errors

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = signupSchema.safeParse(credentials);

    if (!result.success) {
      const errorMessages = {};
      result.error.errors.forEach((error) => {
        errorMessages[error.path[0]] = error.message;
      });
      setErrors(errorMessages);
      return;
    }

    // Call the signup API
    postSignup(result.data)
      .then(() => {
        alert("Signup successful! You can now log in.");
        navigate("/login");
      })
      .catch((error) => {
        setErrors({ api: error.message });
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
        />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={credentials.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>
      <div>
        <label htmlFor="role">Role:</label>
        <select
          name="role"
          value={credentials.role}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="organisation">Organisation</option>
        </select>
        {errors.role && <span className="error">{errors.role}</span>}
      </div>
      {credentials.role === "organisation" && (
        <>
          <div>
            <label htmlFor="organisation_name">Organisation Name:</label>
            <input
              type="text"
              name="organisation_name"
              value={credentials.organisation_name || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="organisation_contact">Organisation Contact:</label>
            <input
              type="text"
              name="organisation_contact"
              value={credentials.organisation_contact || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="organisation_phone_number">Phone Number:</label>
            <input
              type="text"
              name="organisation_phone_number"
              value={credentials.organisation_phone_number || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="organisation_ABN">ABN:</label>
            <input
              type="text"
              name="organisation_ABN"
              value={credentials.organisation_ABN || ""}
              onChange={handleChange}
            />
          </div>
        </>
      )}
      <button type="submit">Sign Up</button>
      {errors.api && <span className="error">{errors.api}</span>}
    </form>
  );
}

export default SignupForm;