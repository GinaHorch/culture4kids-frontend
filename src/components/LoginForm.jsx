import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";
import z from "zod";

import postLogin from "../api/post-login.js";

// Schema validation with Zod
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username must not be empty" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

function LoginForm() {
      const navigate = useNavigate();
      const {auth, setAuth} = useAuth();

      // State for credentials
      const [credentials, setCredentials] = useState({
              username: "",
              password: "",
          });
      
      // Handle input changes
      const handleChange = (event) => {
        const { id, value } = event.target;
        setCredentials((prevCredentials) => {
            return {
              ...prevCredentials,
              [id]: value,
            };
        });
      };
      
      // Handle form submission
      const handleSubmit = (event) => {
        event.preventDefault();
        const result = loginSchema.safeParse(credentials);

        if (!result.success) {
          const error = result.error.errors?.[0];
          if (error) {
            alert(error.message);
          }
          return;
        }
    
        postLogin(result.data.username, result.data.password).then((response) => {
          setAuth({ token: response.token }); // Update auth context
          window.localStorage.setItem("token", response.token);
          navigate("/");
        });          
    };

    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input 
                type="text"
                id="username"
                placeholder="Enter username"
                onChange={handleChange}
            />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input 
                type="password"
                id="password"
                placeholder="Password"
                onChange={handleChange}
              />
        </div>
        <button type="submit" onClick={handleSubmit}>
              Login
           </button>
      </form>
    );
  }
  
  export default LoginForm;