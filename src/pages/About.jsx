import "../styles/about.css";

function About() {
  return (
    <div className="about-page">
      {/* HERO */}

      <section className="about-hero">
        <div className="about-overlay"></div>

        <div className="container">
          <div className="about-hero-content">
            <span className="about-badge">About Battle Blast</span>

            <h1 className="about-hero-title">
              Building Modern Sports Experiences
            </h1>

            <p className="about-hero-text">
              A premium sports complex management platform focused on
              professional facilities, intelligent scheduling, and seamless
              digital experiences for athletes and sports communities across Sri
              Lanka.
            </p>
          </div>
        </div>
      </section>

      {/* STORY SECTION */}

      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-left">
              <span className="section-tag">Our Foundation</span>

              <h2>Designed Around Simplicity, Performance & Accessibility</h2>
            </div>

            <div className="story-right">
              <p>
                Battle Blast Sports Complex was built to modernize sports facility management
                through a cleaner and more intelligent digital experience. From
                reservations to scheduling and training management, the platform
                focuses on efficiency, accessibility, and professional user
                experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}

      <section className="values-section">
        <div className="container">
          <div className="values-grid">
            <div className="value-card">
              <h3>Our Vision</h3>

              <p>
                To become Sri Lanka’s leading smart sports complex platform with
                modern digital experiences and premium sports infrastructure.
              </p>
            </div>

            <div className="value-card">
              <h3>Our Mission</h3>

              <p>
                Deliver seamless reservations, organized scheduling, and
                high-quality sports environments for athletes of every level.
              </p>
            </div>

            <div className="value-card">
              <h3>Why Battle Blast</h3>

              <p>
                Intelligent booking systems, professional facilities, reliable
                management, and modern user-focused experiences in one platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE TIMELINE */}

      <section className="timeline-section">
        <div className="container">
          <div className="timeline-header">
            <span className="section-tag">Platform Experience</span>

            <h2 className="timeline-title">
              Designed To Simplify Sports Management
            </h2>
          </div>

          <div className="timeline-wrapper">
            <div className="timeline-line"></div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>

              <div className="timeline-card">
                <h3>Smart Reservations</h3>

                <p>
                  Fast and organized court booking experiences with simplified
                  scheduling.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>

              <div className="timeline-card">
                <h3>Professional Facilities</h3>

                <p>
                  Modern sports environments designed for both training and
                  competition.
                </p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>

              <div className="timeline-card">
                <h3>Centralized Management</h3>

                <p>
                  Manage sessions, schedules, and sports activities through one
                  streamlined platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FACILITIES */}

      <section className="facilities-section">
        <div className="container">
          <div className="facilities-header">
            <span className="section-tag">Sports Experience</span>

            <h2 className="facilities-title">
              Premium Courts & Coaching Sessions
            </h2>
          </div>

          <div className="facilities-grid">
            <div className="facility-box">
              <h3>Badminton Courts</h3>

              <p>
                Indoor badminton courts with professional flooring, advanced
                lighting, and real-time reservation scheduling.
              </p>
            </div>

            <div className="facility-box">
              <h3>Table Tennis Sessions</h3>

              <p>
                Coach-guided table tennis sessions with assigned tables,
                structured schedules, and professional training support.
              </p>
            </div>

            <div className="facility-box">
              <h3>Professional Coaching</h3>

              <p>
                Certified badminton and table tennis coaches providing beginner,
                intermediate, and competitive training programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MOTTO */}

      <section className="about-motto">
        <div className="container">
          <div className="motto-wrapper">
            <h2>Discipline. Precision. Growth.</h2>

            <p>
              More than sports facilities — a modern environment designed to
              support athletes, communities, and long-term performance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
