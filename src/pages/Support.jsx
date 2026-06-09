import "../styles/support.css";

function Support() {
  return (
    <div className="support-page">
      <div className="container">
        <div className="support-header">
          <h1 className="support-title">Support Center</h1>

          <p className="support-subtitle">
            Get help with bookings, payments, technical issues, and sports
            complex services through our support team.
          </p>
        </div>

        <div className="support-grid">
          <div className="support-card">
            <h2>Live Chat</h2>

            <p>
              Connect instantly with our support representatives for quick
              assistance.
            </p>

            <button className="support-btn">Start Chat</button>
          </div>

          <div className="support-card">
            <h2>Email Support</h2>

            <p>
              Send detailed inquiries and receive support from our dedicated
              team.
            </p>

            <button className="support-btn">Send Email</button>
          </div>

          <div className="support-card">
            <h2>Call Center</h2>

            <p>
              Contact our Sri Lankan support team for immediate booking
              assistance.
            </p>

            <button className="support-btn">Call Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;
