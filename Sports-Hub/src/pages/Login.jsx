import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { apiClient } from "../services/api/client";
import axios from "axios";
import "../styles/login.css";


function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useBooking();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      const session = await apiClient.login({ email, password });
      
      if (session) {
   
        loginUser(session);
        setSuccessMessage("Login successful. Redirecting...");

        try {
          const response = await axios.post("http://localhost:5000/login", {
            email,
            password,
          });

          const { role, fullName } = response.data;

          if (role === "admin") {
        
            localStorage.setItem("isAdmin", "true");
            localStorage.setItem("userName", fullName);

   
            navigate("/admin-dashboard", { replace: true });
            return;
          }
        } catch (err) {
          setLoading(false);
    
          setError(err.response?.data?.message || "Invalid credentials or server error.");
          return;
        }

        setTimeout(() => {
          const userRole = session.role || session.user?.role;

          if (userRole === "admin") {
            navigate("/admin-dashboard", { replace: true });
          } else {
            navigate(from, { replace: true });
          }
        }, 800);
      }
    } catch (apiError) {

      const errorMessage = apiError.response?.data?.message || "Invalid email or password.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay"></div>
      <div className="login-wrapper">
  
        <div className="login-left">
          <span className="login-badge">Battle Blast Access</span>
          <h1 className="login-title">Continue Your Sports Experience</h1>
          <p className="login-subtitle">
            Browse facilities freely and login only when you are ready to
            reserve courts, coaching sessions, or manage bookings.
          </p>
        </div>

        <div className="login-container">
          <h2 className="form-title">Welcome Back</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-group">
              <label>Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && <div className="login-error" style={{color: "red", marginTop: "10px"}}>{error}</div>}
            {successMessage && <div className="login-success" style={{color: "green", marginTop: "10px"}}>{successMessage}</div>}

            <button className="login-btn-main" disabled={loading}>
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          <div className="login-links">
            <Link to="/forgot-password">Forgot Password?</Link>
            <Link to="/register">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login


