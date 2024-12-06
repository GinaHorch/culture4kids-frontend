import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";

import "./NavBar.css";

function NavBar() {
    const {auth, setAuth} = useAuth(); // to manage authentication state

    const handleLogout = () => {
      try {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
          window.localStorage.removeItem("token");
          setAuth({ token: null });
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>       
          {auth.token ? (
            <>
              <li><Link to="/" onClick={handleLogout}>Log Out</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </>
          )}
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

export default NavBar;