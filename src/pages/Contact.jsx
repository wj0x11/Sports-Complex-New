import { useState } from "react";
import { apiClient } from "../services/api/client";
import "../styles/contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    const { name, email, subject, message } = formData;

    if (!name.trim()) {
      setError("Please enter your name.");
      return false;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!subject.trim()) {
      setError("Please enter a subject.");
      return false;
    }

    if (!message.trim()) {
      setError("Please enter your message.");
      return false;
    }

    if (message.trim().length < 10) {
      setError("Message must be at least 10 characters.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      await apiClient.submitContact({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setSuccess(
        "Your message has been sent successfully. Our team will respond shortly.",
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send your message. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-overlay"></div>

        <div className="container">
          <div className="contact-hero-content">
            <span className="contact-badge">
              Contact Battle Blast Sports Complex
            </span>

            <h1 className="contact-title">Let's Connect With Our Team</h1>

            <p className="contact-subtitle">
              Reach out for reservations, facility inquiries, coaching details,
              partnerships, or support related to our platform.
            </p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info-card">
              <h2 className="contact-info-title">Contact Information</h2>

              <div className="contact-item">
                <span className="contact-label">Phone</span>
                <p>+94 77 123 4567</p>
              </div>

              <div className="contact-item">
                <span className="contact-label">Email</span>
                <p>support@sportshub.lk</p>
              </div>

              <div className="contact-item">
                <span className="contact-label">Location</span>
                <p>No. 25, Main Street, Colombo, Sri Lanka</p>
              </div>

              <div className="contact-item">
                <span className="contact-label">Opening Hours</span>
                <p>
                  Monday — Sunday
                  <br />
                  6:00 AM — 10:00 PM
                </p>
              </div>
            </div>

            <div className="contact-form-card">
              <h2 className="contact-form-title">Send Message</h2>

              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="input-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {error && <div className="contact-alert contact-error">{error}</div>}
                {success && (
                  <div className="contact-alert contact-success">{success}</div>
                )}

                <button
                  className="send-message-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-motto">
        <div className="container">
          <div className="contact-motto-wrapper">
            <h2>Professional Support For Modern Sports Management</h2>

            <p>
              Battle Blast Sports Complex focuses on delivering smooth
              communication, organized facility experiences, and reliable
              support for athletes and sports communities across Sri Lanka.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
