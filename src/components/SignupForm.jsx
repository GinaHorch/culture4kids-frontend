import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { useAuth } from "../hooks/use-auth";
import postSignup from "../api/post-signup";

// Schema validation for signup
const signupSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
    role: z.enum(["user", "organisation"], { message: "Role is required" }),
    organisation_name: z.string().optional(),
    organisation_contact: z.string().optional(),
    organisation_phone_number: z.string().optional(),
    organisation_ABN: z.string().optional(),
    is_charity: z.boolean().optional(),
  })
  
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })

  .superRefine((data, ctx) => {
    // Conditionally validate organisation fields
    if (data.role === "organisation") {
      if (!data.organisation_name) {
        ctx.addIssue({
          code: "too_small",
          minimum: 1,
          message: "Organisation name is required",
          path: ["organisation_name"],
        });
      }
      if (!data.organisation_contact) {
        ctx.addIssue({
          code: "too_small",
          minimum: 1,
          message: "Organisation contact is required",
          path: ["organisation_contact"],
        });
      }
      if (!data.organisation_phone_number) {
        ctx.addIssue({
          code: "too_small",
          minimum: 1,
          message: "Phone number is required",
          path: ["organisation_phone_number"],
        });
      }
      if (!data.organisation_ABN || data.organisation_ABN.length < 11) {
        ctx.addIssue({
          code: "too_small",
          minimum: 11,
          message: "ABN must be at least 11 characters",
          path: ["organisation_ABN"],
        });
      }
    }
  });

function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
    organisation_name: "",
    organisation_contact: "",
    organisation_phone_number: "",
    organisation_ABN: "",
    is_charity: false, // Default to not a charity
  });
  const [errors, setErrors] = useState({}); // For displaying validation errors

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Handle submit triggered");

    const result = signupSchema.safeParse(credentials);
    console.log("Validation result:", result);

    if (!result.success) {
      const errorMessages = {};
      result.error.errors.forEach((error) => {
        errorMessages[error.path[0]] = error.message;
      });
      setErrors(errorMessages);
      return;
    }

    // Adjust the payload for organisations
    const payload = {
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
      confirm_password: credentials.confirmPassword,
      role: credentials.role,
    }

    if (payload.role === "organisation") {
      payload.organisation_name = credentials.organisation_name || "";
      payload.organisation_contact = credentials.organisation_contact || "";
      payload.organisation_phone_number = credentials.organisation_phone_number || "";
      payload.organisation_ABN = credentials.organisation_ABN || "";
      payload.is_charity = credentials.is_charity || false;
    }

    try {
      const data = await postSignup(payload);
      console.log("Payload sent to API:", payload);
  
      if (data.token) {
        // API provides a token: Log the user in immediately
        await signup(data);
        alert("Signup successful! You are now logged in.");
        navigate("/");
      } else {
        // API does not provide a token: Redirect to login
        alert("Signup successful! Please log in to continue.");
        navigate("/login");
      }
    } catch (error) {
      setErrors({ api: error.message });
      console.error("Signup error:", error.message);
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
          autoComplete="username"
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
          autoComplete="email"
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
          autoComplete="new-password"
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
          autoComplete="new-password"
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
              autoComplete="organisation"
            />
            {errors.organisation_name && <span className="error">{errors.organisation_name}</span>}
          </div>
          <div>
            <label htmlFor="organisation_contact">Organisation Contact:</label>
            <input
              type="text"
              name="organisation_contact"
              value={credentials.organisation_contact || ""}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="organisation_phone_number">Phone Number:</label>
            <input
              type="text"
              name="organisation_phone_number"
              value={credentials.organisation_phone_number || ""}
              onChange={handleChange}
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="organisation_ABN">ABN:</label>
            <input
              type="text"
              name="organisation_ABN"
              value={credentials.organisation_ABN || ""}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="is_charity"
                checked={credentials.is_charity || false}
                onChange={(e) =>
                  setCredentials((prev) => ({
                  ...prev,
                  is_charity: e.target.checked,
                }))
              }
            />
            Is this organisation a registered charity?
          </label>
         </div>
        </>
      )}
      <button type="submit">Sign Up</button>
      {errors.api && <span className="error">{errors.api}</span>}
    </form>
  );
}

export default SignupForm;