import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { useAuth } from "../hooks/use-auth";

// Schema validation for signup
const signupSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
    role: z.enum(["user", "organisation"], { message: "Role is required" }),
    organisation_name: z.string().min(1, { message: "Organisation name is required" }).optional(),
    organisation_contact: z.string().min(1, { message: "Organisation contact is required" }).optional(),
    organisation_phone_number: z.string().min(1, { message: "Phone number is required" }).optional(),
    organisation_ABN: z.string().min(11, { message: "ABN must be at least 11 characters" }).optional(),
    is_charity: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.role === "user" ||
      (data.role === "organisation" &&
        data.organisation_name &&
        data.organisation_contact &&
        data.organisation_phone_number &&
        data.organisation_ABN),
    {
      message: "All organisation fields are required for organisations",
      path: ["organisation_name"],
    }
  )

  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
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

    const result = signupSchema.safeParse(credentials);

    if (!result.success) {
      const errorMessages = {};
      result.error.errors.forEach((error) => {
        errorMessages[error.path[0]] = error.message;
      });
      setErrors(errorMessages);
      return;
    }

    // Adjust the payload for organisations
    const payload = { ...result.data };
    if (payload.role === "organisation") {
      payload.organisation_name = credentials.organisation_name || "";
      payload.organisation_contact = credentials.organisation_contact || "";
      payload.organisation_phone_number = credentials.organisation_phone_number || "";
      payload.organisation_ABN = credentials.organisation_ABN || "";
      payload.is_charity = credentials.is_charity || false;
    }

    try {
      // Call postSignup
      await signup(payload);
      alert("Signup successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      setErrors({ api: error.message });
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