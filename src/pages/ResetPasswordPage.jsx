import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function ResetPasswordPage() {
    const { id } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/reset-password/${id}`, { password });
            setMessage(response.data.message || "Password updated successfully!");
            
            setTimeout(() => {
                navigate('/login');
            }, 2500);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: "fixed", 
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "20px",
            boxSizing: "border-box",
            zIndex: 99999, 
            overflowY: "auto"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "450px",
                backgroundColor: "rgba(30, 41, 59, 0.7)", 
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "24px",
                padding: "40px 30px",
                boxShadow: "0 24px 50px rgba(0, 0, 0, 0.6)",
                color: "#ffffff",
                fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
            }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "35px" }}>
                    <h2 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 10px 0", letterSpacing: "-0.5px" }}>
                        Reset Password
                    </h2>
                    <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
                        Enter your new secure password below to regain access.
                    </p>
                </div>

               
                <form onSubmit={handleSubmit}>
                    {/* New Password */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#cbd5e1" }}>
                            New Password
                        </label>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter new password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={{ 
                                width: "100%", 
                                padding: "14px 16px", 
                                borderRadius: "12px", 
                                border: "1px solid rgba(255, 255, 255, 0.1)", 
                                backgroundColor: "rgba(15, 23, 42, 0.6)", 
                                color: "#ffffff",
                                fontSize: "15px",
                                boxSizing: "border-box",
                                outline: "none"
                            }}
                        />
                    </div>
                    
                   
                    <div style={{ marginBottom: "12px" }}>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "8px", color: "#cbd5e1" }}>
                            Confirm New Password
                        </label>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Confirm new password"
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} // 💡 මෙන්න මෙතන මම වැරැද්ද හැදුවා!
                            required 
                            style={{ 
                                width: "100%", 
                                padding: "14px 16px", 
                                borderRadius: "12px", 
                                border: "1px solid rgba(255, 255, 255, 0.1)", 
                                backgroundColor: "rgba(15, 23, 42, 0.6)", 
                                color: "#ffffff",
                                fontSize: "15px",
                                boxSizing: "border-box",
                                outline: "none"
                            }}
                        />
                    </div>

                 
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "25px" }}>
                        <span 
                            onClick={() => setShowPassword(!showPassword)} 
                            style={{ fontSize: "13px", color: "#84cc16", cursor: "pointer", fontWeight: "500", userSelect: "none" }}
                        >
                            {showPassword ? "Hide Password" : "Show Password"}
                        </span>
                    </div>

                  
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            width: "100%", 
                            padding: "14px", 
                            backgroundColor: "#84cc16", 
                            border: "none", 
                            borderRadius: "12px", 
                            fontWeight: "600", 
                            fontSize: "16px",
                            cursor: loading ? "not-allowed" : "pointer", 
                            color: "#0f172a",
                            boxShadow: "0 4px 12px rgba(132, 204, 22, 0.25)",
                            transition: "all 0.2s ease"
                        }}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>

                  
                    {message && (
                    <div style={{ 
                        marginTop: "20px", padding: "12px", borderRadius: "10px", 
                        backgroundColor: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.3)",
                        color: "#4ade80", textAlign: "center", fontSize: "14px", fontWeight: "500" 
                    }}>
                        {message}
                    </div>
                )}
                
                {error && (
                    <div style={{ 
                        marginTop: "20px", padding: "12px", borderRadius: "10px", 
                        backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)",
                        color: "#f87171", textAlign: "center", fontSize: "14px", fontWeight: "500" 
                    }}>
                        {error}
                    </div>
                )}

              
                <div style={{ textAlign: "center", marginTop: "25px", fontSize: "14px" }}>
                    <Link to="/login" style={{ color: "#94a3b8", textDecoration: "none" }}>
                        ← Back to <span style={{ color: "#84cc16", fontWeight: "500" }}>Login</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;