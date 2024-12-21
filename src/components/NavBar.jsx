import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";
import { useState } from "react";
import logo from "../assets/LogoCulture4Kids.png";

import "./NavBar.css";

function NavBar() {
    const {auth, logout} = useAuth(); // to manage authentication state
    const [menuOpen, setMenuOpen] = useState(false); // State for toggling burger menu
    console.log("Rendering NavBar");

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
          logout(); // Use the logout function from useAuth
      }
    };

    return (
      <div>
        <nav className="navbar" role="navigation" aria-label="Main Navigation">
          <Link to="/" className="navbar-logo">
          <img src={logo} alt="Culture4Kids Logo" className="navbar-logo-img" />
          <span className="sr-only">Culture4Kids Home</span> {/* Screen reader only */}
          </Link>

          <div
            className={`burger-menu ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <div className="burger-bar"></div>
            <div className="burger-bar"></div>
            <div className="burger-bar"></div>
          </div>

          <ul className={`navbar-links ${menuOpen ? "open" : ""}`} role="menu" aria-label="Navigation Links">
            <li role="menuitem">
              <Link to="/">Home</Link>
            </li>
            <li role="menuitem">
              <Link to="/projects">Projects</Link>
            </li>
            {auth.token ? (
              <>
                <li role="menuitem">
                  <Link to="/" onClick={handleLogout}>
                    Log Out
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li role="menuitem">
                  <Link to="/login">Login</Link>
                </li>
                <li role="menuitem">
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