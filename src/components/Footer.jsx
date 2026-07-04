import { Link } from "react-router-dom";

import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo-wrapper">
              <img
                src="/favicon.svg"
                alt="Battle Blast Sports Complex"
                className="footer-logo-image"
              />

              <div>
                <h2 className="footer-logo">Battle Blast</h2>

                <span className="footer-logo-subtitle">Sports Complex</span>
              </div>
            </div>

            <p className="footer-description">
              Premium indoor badminton and table tennis experience with modern
              booking, smart scheduling, coaching programs, and professional
              sports facility management.
            </p>

            <div className="footer-socials">
              <a href="/">Facebook</a>

              <a href="/">Instagram</a>

              <a href="/">YouTube</a>
            </div>
          </div>

          <div className="footer-grid">
            <div>
              <h3 className="footer-title">Quick Links</h3>

              <ul className="footer-links">
                <li>
                  <Link to="/">Home</Link>
                </li>

                <li>
                  <Link to="/about">About</Link>
                </li>

                <li>
                  <Link to="/our-coaches">Coaches</Link>
                </li>

                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="footer-title">Sports</h3>

              <ul className="footer-links">
                <li>
                  <Link to="/sports/badminton">Badminton</Link>
                </li>

                <li>
                  <Link to="/sports/table-tennis">Table Tennis</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="footer-title">Contact</h3>

              <div className="footer-contact">
                <p>
                  Battle Blast Sports Complex
                  <br />
                  3rd Lane, Heraliyawala
                  <br />
                  Kurunegala, Sri Lanka
                </p>

                <p>battleblast.sportscomplex@yahoo.com</p>

                <p>+94 71 492 5338</p>

                <a
                  href="https://maps.google.com/?q=F8PW+GWJ,3rd+Ln,Kurunegala"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-map-link"
                >
                  Open Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>© 2026 Battle Blast Sports Complex. All rights reserved.</p>

          <span>Modern Sports Reservation Experience</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
