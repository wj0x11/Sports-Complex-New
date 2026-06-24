import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import "../styles/home.css";

function Home() {
  const slides = [
    {
      title: "Battle Blast Sports Complex",
      text: "Professional badminton, table tennis, basketball, and volleyball facilities with premium booking management, modern coaching, and organized indoor sports experiences.",
      image: "badminton1.jpg",
    },

    {
      title: "Train With Precision",
      text: "Reserve courts and coaching sessions through one connected sports reservation platform.",
      image: "badminton3.jpg",
    },

    {
      title: "Built For Competitive Performance",
      text: "Designed for athletes, students, and sports communities seeking professional indoor sports environments.",
      image: "tt4.jpg",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="home-page">
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${slides[currentSlide].image})`,
        }}
      >
        <div className="hero-overlay"></div>

        <div className="container hero-content">
          <span className="hero-badge">
            Sri Lanka’s Premium Indoor Sports Complex
          </span>

          <h1 className="hero-title">{slides[currentSlide].title}</h1>

          <p className="hero-text">{slides[currentSlide].text}</p>

          <div className="hero-buttons">
            <Link to="/sports/badminton">
              <button className="primary-btn">Start Booking</button>
            </Link>

            <Link to="/about">
              <button className="secondary-btn">Explore Facility</button>
            </Link>
          </div>

          <div className="slide-indicators">
            {slides.map((_, index) => (
              <span
                key={index}
                className={
                  currentSlide === index
                    ? "indicator active-indicator"
                    : "indicator"
                }
              ></span>
            ))}
          </div>
        </div>
      </section>

      <section className="intro-section section-spacing">
        <div className="container intro-grid">
          <div>
            <span className="section-tag">Smart Sports Management</span>

            <h2 className="section-title">
              A Modern Booking Experience For Indoor Sports
            </h2>
          </div>

          <div>
            <p className="section-text">
              Battle Blast Sports Complex combines modern reservations,
              structured scheduling, coaching programs, and professional sports
              experiences into one connected platform.
            </p>
          </div>
        </div>
      </section>

      <section className="experience-section section-spacing">
        <div className="container">
          <div className="experience-wrapper">
            <div className="experience-text">
              <span className="section-tag">Intelligent Booking Workflow</span>

              <h2>Everything Connected Into One Smooth Experience</h2>

              <p>
                Select sports, reserve courts, add coaching and complete
                reservations through one streamlined system.
              </p>
            </div>

            <div className="experience-panel">
              <div className="panel-line"></div>

              <div className="panel-item">
                <h3>Connected Reservations</h3>

                <p>
                  Court reservations and coaching sessions bookings unified into
                  one smooth workflow.
                </p>
              </div>

              <div className="panel-item">
                <h3>Professional Scheduling</h3>

                <p>
                  Organized booking slots and structured time management for
                  efficient operations.
                </p>
              </div>

              <div className="panel-item">
                <h3>Modern User Experience</h3>

                <p>
                  Clean layouts, responsive design, and premium sports platform
                  interactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section section-spacing">
        <div className="container">
          <div className="features-header">
            <span className="section-tag">Core Features</span>

            <h2 className="section-title">
              Designed For Modern Sports Management
            </h2>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <h3>Multi-Service Booking</h3>

              <p>Reserve courts and coaching sessions together.</p>
            </div>

            <div className="feature-card">
              <h3>Real-Time Scheduling</h3>

              <p>
                Organized booking slots and structured reservation workflows.
              </p>
            </div>

            <div className="feature-card">
              <h3>Premium Facility Access</h3>

              <p>
                Built for competitive indoor sports training and professional
                experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section section-spacing">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-box">
              <h2>4</h2>

              <p>Badminton Courts</p>
            </div>

            <div className="stat-box">
              <h2>3+</h2>

              <p>Professional Coaches</p>
            </div>

            <div className="stat-box">
              <h2>100+</h2>

              <p>Monthly Reservations</p>
            </div>

            <div className="stat-box">
              <h2>4</h2>

              <p>Indoor Sports</p>
            </div>
          </div>
        </div>
      </section>

      <section className="reviews-section section-spacing">
        <div className="container">
          <div className="reviews-header">
            <span className="section-tag">Community Feedback</span>

            <h2 className="section-title">Trusted By Players & Athletes</h2>
          </div>

          <div className="reviews-grid">
            <div className="review-card">
              <p>
                “The system feels smooth and professional. Court reservations
                are much easier now.”
              </p>

              <h4>— Kavindu Perera</h4>
            </div>

            <div className="review-card">
              <p>
                “Clean interface, organized booking flow, and a genuinely
                premium experience.”
              </p>

              <h4>— Nethmi Silva</h4>
            </div>

            <div className="review-card">
              <p>
                “Courts and Coaches reservations being integrated together is
                extremely convenient.”
              </p>

              <h4>— Dhanuka Fernando</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="motto-section section-spacing">
        <div className="container">
          <div className="motto-card">
            <h2>Discipline. Precision. Competitive Excellence.</h2>

            <p>
              More than a booking platform — a professional sports environment
              designed for training, growth, and performance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
