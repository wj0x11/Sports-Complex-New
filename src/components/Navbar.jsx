import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getFeaturedSports } from "../services/sports.service";
import { useBooking } from "../context/BookingContext";
import "../styles/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { isLoggedIn, logoutUser } = useBooking();
  const featuredSports = getFeaturedSports();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/sports") {
      return location.pathname === "/sports" ||
        location.pathname.startsWith("/sports/")
        ? "active-link"
        : "";
    }
    return location.pathname === path ? "active-link" : "";
  };

  const handleDropdownKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setDropdownOpen((prev) => !prev);
    }
    if (event.key === "Escape") {
      setDropdownOpen(false);
    }
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="container">
        <div className="navbar-container">
          <Link to="/" className="logo">
            <img
              src="logo.png"
              alt="Battle Blast Sports Complex"
              className="logo-image"
            />
            <div className="logo-text">
              <h2>Battle Blast</h2>
              <span>Sports Complex</span>
            </div>
          </Link>

          <nav
            className={`nav-menu ${menuOpen ? "active-menu" : ""}`}
            aria-label="Main navigation"
          >
            <ul className="nav-links">
              <li>
                <Link to="/" className={isActive("/")}>
                  Home
                </Link>
              </li>

              <li
                className={`dropdown ${dropdownOpen ? "dropdown-open" : ""}`}
                ref={dropdownRef}
              >
                <div className="dropdown-trigger">
                  <Link
                    to="/sports"
                    className={isActive("/sports")}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Sports
                  </Link>
                  <button
                    type="button"
                    className="dropdown-toggle"
                    aria-label="Toggle sports menu"
                    aria-expanded={dropdownOpen}
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    onKeyDown={handleDropdownKeyDown}
                  >
                    ▾
                  </button>
                </div>

                <div className="dropdown-menu">
                  {featuredSports.map((sport) => (
                    <Link
                      key={sport.id}
                      to={`/sports/${sport.slug}`}
                      onClick={() => setDropdownOpen(false)}
                    >
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
                    <strong>Member Portal</strong>
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
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
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
