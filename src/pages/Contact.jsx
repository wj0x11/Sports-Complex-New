import "../styles/contact.css";

function Contact() {
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

              <form className="contact-form">
                <div className="input-group">
                  <input type="text" placeholder="Your Name" />
                </div>

                <div className="input-group">
                  <input type="email" placeholder="Your Email" />
                </div>

                <div className="input-group">
                  <input type="text" placeholder="Subject" />
                </div>

                <div className="input-group">
                  <textarea placeholder="Your Message"></textarea>
                </div>

                <button className="send-message-btn">Send Message</button>
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
