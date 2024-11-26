import { useState } from "react";
import postLogin from "../api/post-login.js";

function LoginForm() {
      const [credentials, setCredentials] = useState({
              username: "",
              password: "",
          });
        
          const handleChange = (event) => {
              const { id, value } = event.target;
              setCredentials((prevCredentials) => ({
                  ...prevCredentials,
                  [id]: value,
              }));
          };

            const handleSubmit = (event) => {
                  event.preventDefault();
                  if (credentials.username && credentials.password) {
                      postLogin(
                          credentials.username,
                          credentials.password
                      ).then((response) => {
                          console.log(response);
                      });
                  }
              };

    return (
      <form on>
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