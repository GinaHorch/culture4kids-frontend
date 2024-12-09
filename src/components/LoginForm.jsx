import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";
import z from "zod";

// Schema validation with Zod
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username must not be empty" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);

      // State for credentials
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
      
      // Handle input changes
  const handleChange = (event) => {
    const { id, value } = event.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value,      
    }));
    console.log("Updated credentials:", { ...credentials, [id]: value }); 
  };
      
      // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setErrors("");

    console.log("Submitting login form with credentials:", credentials);
      
    const result = loginSchema.safeParse(credentials); // Validate credentials
    if (!result.success) {
      const error = result.error.errors?.[0];
      if (error) {
        console.error("Validation error:", error.message);
        setErrors(error.message); // Set validation error
      }
      return;
    }
      
    setIsLoading(true); // Enable loading state
          
    try {
      await login(credentials);
      navigate("/"); // Redirect to homepage
    } catch (error) {
      console.error("Login failed:", error.message);
      setErrors(error.message || "Invalid username or password.");
    } finally {
      setIsLoading(false); // Disable loading state
    }
  };      
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input 
            type="text"
            id="username"
            placeholder="Enter username"
            value={credentials.username}
            onChange={handleChange}
            autoComplete="username"
        />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input 
                type="password"
                id="password"
                placeholder="Enter password"
                value={credentials.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
        </div>
        {errors && <p className="error">{errors}</p>} {/* Display error messages */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    );
  }
  
  export default LoginForm;