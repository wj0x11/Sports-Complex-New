import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import "../styles/register.css";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useBooking(); 


  const redirectTo = location.state?.redirectTo || "/login"; 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const { fullName, email, phone, password, confirmPassword } = formData;


    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
      setLoading(true);

   
      const response = await axios.post("http://localhost:5000/register", {
        fullName,
        email: normalizedEmail,
        phone,
        password,
      });

      console.log("MongoDB has Registered User:", response.data);

    
      navigate(redirectTo, { state: { message: "Registration successful! Please login." } });

    } catch (err) {
      console.error("MongoDB Error:", err);
      setError(
        err.response?.data?.message || 
        "Cannot connect to the server. Please check if your Backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

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
          <p className="form-subtitle">Register to continue with Battle Blast Sports Complex.</p>

          <form className="register-form" onSubmit={handleRegister}>
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
                  type="text"
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
                  <button type="button" className="toggle-password" onClick={() => setShowPassword((prev) => !prev)}>
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
                  <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            {error && <div className="register-error" style={{ color: "red", marginBottom: "15px" }}>{error}</div>}

            <button className="register-btn" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="browse-text">
            Sports facilities, schedules, and coaching information can still be explored without registration.
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
