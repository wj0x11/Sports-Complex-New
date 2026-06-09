import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
 
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      const { role, fullName, token } = response.data;


      localStorage.setItem("token", token);
      localStorage.setItem("userName", fullName);
      localStorage.setItem("role", role);


      if (role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login incorrect. Please try again.");
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

export default AdminLogin;