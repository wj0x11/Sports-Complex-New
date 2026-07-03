import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/forgotPassword.css";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devResetLink, setDevResetLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setMessage("");
    setError("");
    setDevResetLink("");

    try {
      // ✅ URL එක Backend එකට ගැලපෙන සේ /api/forgot-password ලෙස නිවැරදි කර ඇත
      const response = await axios.post("http://localhost:5000/api/forgot-password", {
        email: email
      });

      if (response.status === 200) {
        setMessage(response.data.message || "Password reset link sent! Please check your email.");
        if (response.data.devResetUrl) {
          setDevResetLink(response.data.devResetUrl);
        }
        setEmail(""); 
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Server error. Please check your network connection.");
      }
    } finally {
      loading && setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h1 className="forgot-password-title">Forgot Password</h1>

        <p className="forgot-password-subtitle">
          Enter your email address and we will send password reset instructions
          to your account.
        </p>

        {message && <div className="success-message" style={{color: 'green', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold'}}>{message}</div>}
        {devResetLink && (
          <div className="dev-link-container" style={{background: '#e8f4fd', border: '1px solid #b8daff', padding: '15px', borderRadius: '14px', marginBottom: '15px'}}>
            <span style={{fontWeight: 'bold', color: '#004085'}}>Development Link:</span>{" "}
            <a href={devResetLink} style={{color: '#007bff', wordBreak: 'break-all', textDecoration: 'underline'}}>
              {devResetLink}
            </a>
          </div>
        )}
        {error && <div className="error-message" style={{color: 'red', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold'}}>{error}</div>}

        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <div className="forgot-password-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className="reset-password-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="back-login-text">
          Remember your password? <Link to="/login">Back To Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
