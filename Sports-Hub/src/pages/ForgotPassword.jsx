import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/forgotPassword.css";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
   
      const response = await axios.post("http://localhost:5000/forgot-password", {
        email: email,
      });

  
      setMessage(response.data.message || "Password reset link sent! Please check your email.");
      setEmail("");
    } catch (err) {
   
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

     
        {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

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
