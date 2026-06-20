import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { apiClient } from "../services/api/client";
import "../styles/register.css";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useBooking();

  const redirectTo = location.state?.redirectTo || "/login";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    const { fullName, email, phone, password, confirmPassword } = formData;

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return false;
    }

    if (!email.trim()) {
      setError("Please enter a valid email address.");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError("Please enter a properly formatted email address.");
      return false;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    const { fullName, email, phone, password } = formData;
    const normalizedEmail = email.trim().toLowerCase();

    try {
      setLoading(true);

      await apiClient.registerUser({
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        password,
      });

      setSuccess(true);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Cannot connect to the server. Please check if your backend is running on port 5000.";

      if (
        message.toLowerCase().includes("duplicate") ||
        message.toLowerCase().includes("already")
      ) {
        setError(
          "An account with this email already exists. Please log in instead.",
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-page">
        <div className="register-overlay"></div>
        <div className="register-success-wrapper">
          <div className="register-success-card">
            <div className="success-icon">✓</div>
            <h2>Account Created Successfully</h2>
            <p>
              Your Battle Blast Sports Complex account has been created. You can
              now log in to book courts, reserve coaching sessions, and manage
              your reservations.
            </p>
            <Link to={redirectTo} className="register-btn success-btn">
              Continue to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-overlay"></div>
      <div className="register-wrapper">
        <div className="register-left">
          <span className="register-badge">Join Battle Blast</span>
          <h1 className="register-title">Start Your Sports Journey</h1>
          <p className="register-subtitle">
            Create your account to access reservations, coaching sessions,
            premium facilities, and personalized sports experiences.
          </p>
        </div>

        <div className="register-container">
          <h2 className="form-title">Create Account</h2>
          <p className="form-subtitle">
            Register to continue with Battle Blast Sports Complex.
          </p>

          <form className="register-form" onSubmit={handleRegister} noValidate>
            <div className="register-grid">
              <div className="register-group full-width">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="John Perera"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register-group full-width">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="john@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register-group full-width">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+94 77 123 4567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register-group">
                <label htmlFor="password">Password</label>
                <div className="password-field">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="register-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-field">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            {error && <div className="register-error">{error}</div>}

            <button className="register-btn" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="browse-text">
            Sports facilities, schedules, and coaching information can still be
            explored without registration.
          </p>
          <p className="login-redirect">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
