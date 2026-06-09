import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import sportsData from "../data/sportsData";

import { useBooking } from "../context/BookingContext";

import "../styles/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { isLoggedIn, logoutUser } = useBooking();

  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutUser();

    localStorage.removeItem("user");

    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active-link" : "";
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-container">
          <Link to="/" className="logo">
            <img
              src="/logo.png"
              alt="Battle Blast Sports Complex"
              className="logo-image"
            />

            <div className="logo-text">
              <h2>Battle Blast</h2>

              <span>Sports Complex</span>
            </div>
          </Link>

          <nav className={`nav-menu ${menuOpen ? "active-menu" : ""}`}>
            <ul className="nav-links">
              <li>
                <Link to="/" className={isActive("/")}>
                  Home
                </Link>
              </li>

              <li className="dropdown">
                <span className="dropdown-title">Sports</span>

                <div className="dropdown-menu">
                  {sportsData.map((sport) => (
                    <Link key={sport.id} to={`/sports/${sport.slug}`}>
                      {sport.name}
                    </Link>
                  ))}
                </div>
              </li>

              <li>
                <Link to="/about" className={isActive("/about")}>
                  About
                </Link>
              </li>

              <li>
                <Link to="/contact" className={isActive("/contact")}>
                  Contact
                </Link>
              </li>

              {isLoggedIn && (
                <li>
                  <Link to="/dashboard" className={isActive("/dashboard")}>
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>

            <div className="nav-actions">
              {isLoggedIn ? (
                <div className="logged-user-section">
                  <div className="user-welcome">
                    <strong><h4>Member Portal</h4></strong>
                  </div>

                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="auth-link">
                  <button className="login-btn">Login / Register</button>
                </Link>
              )}
            </div>
          </nav>

          <button
            className={`menu-toggle ${menuOpen ? "toggle-active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>

            <span></span>

            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
