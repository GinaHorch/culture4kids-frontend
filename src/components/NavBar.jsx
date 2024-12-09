import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";

import "./NavBar.css";

function NavBar() {
    const {auth, logout} = useAuth(); // to manage authentication state
    console.log("Rendering NavBar");

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
          logout(); // Use the logout function from useAuth
      }
    };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>       
          {auth.token ? (
            <>
              <li>
                <Link to="/" onClick={handleLogout}>Log Out</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

export default NavBar;