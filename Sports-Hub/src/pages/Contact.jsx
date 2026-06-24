import { useState } from "react";
import { apiClient } from "../../../src/services/api/client";
import "../styles/contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus({ type: "error", message: "Please complete all fields." });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }
    try {
      setSubmitting(true);
      await apiClient.submitContactMessage(form);
      setStatus({
        type: "success",
        message: "Message submitted successfully. Our team will contact you soon.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus({
        type: "error",
        message: "Could not send your message right now. Please try again.",
      });
    } finally {
      setSubmitting(false);
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

            <h1 className="contact-title">Let’s Connect With Our Team</h1>

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

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={form.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {status.message && (
                  <div
                    className={
                      status.type === "success"
                        ? "contact-status-success"
                        : "contact-status-error"
                    }
                  >
                    {status.message}
                  </div>
                )}

                <button className="send-message-btn" disabled={submitting}>
                  {submitting ? "Sending..." : "Send Message"}
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
