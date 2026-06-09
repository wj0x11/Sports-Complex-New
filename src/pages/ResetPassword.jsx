import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../styles/resetPassword.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!token) {
      setError("Reset token is missing from the URL. Please request a new link.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/reset-password", {
        token: token,
        password: password,
      });

      if (response.status === 200) {
        setMessage(response.data.message || "Password successfully reset! Redirecting to login...");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Server error. Please check your network connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-overlay"></div>
      <div className="reset-password-container">
        <h1 className="reset-password-title">Reset Password</h1>

        <p className="reset-password-subtitle">
          Please enter and confirm your new password below to regain access to your account.
        </p>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {!token ? (
          <div className="error-message" style={{ margin: "20px 0" }}>
            Invalid reset link. Please go back to the <Link to="/forgot-password" style={{ color: "#6290c3", fontWeight: "bold" }}>Forgot Password</Link> page.
          </div>
        ) : (
          <form className="reset-password-form" onSubmit={handleSubmit}>
            <div className="reset-password-group">
              <label>New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="reset-password-group">
              <label>Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="show-password-checkbox">
              <input
                type="checkbox"
                id="show-password-toggle"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="show-password-toggle">Show Passwords</label>
            </div>

            <button type="submit" className="change-password-btn" disabled={loading}>
              {loading ? "Resetting..." : "Save New Password"}
            </button>
          </form>
        )}

        <p className="back-login-text">
          Remember your password? <Link to="/login">Back To Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
