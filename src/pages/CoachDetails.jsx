import { useParams, Link } from "react-router-dom";

import sportsData from "../data/sportsData";

import "../styles/coachDetails.css";

function CoachDetails() {
  const { id } = useParams();

  let selectedCoach = null;

  sportsData.forEach((sport) => {
    const foundCoach = sport.coaches.find(
      (coach) => coach.id === parseInt(id)
    );

    if (foundCoach) {
      selectedCoach = foundCoach;
    }
  });

  if (!selectedCoach) {
    return (
      <div className="container">
        <h1>Coach Not Found</h1>
      </div>
    );
  }

  return (
    <div className="coach-page">
      <div className="container">
        <div className="coach-container">
          {/* TOP SECTION */}

          <div className="coach-top">
            <h1 className="coach-name">
              {selectedCoach.name}
            </h1>

            <p className="coach-rating">
              ⭐ {selectedCoach.rating} Rating
            </p>
          </div>

          {/* CONTENT */}

          <div className="coach-content">
            {/* STATS */}

            <div className="coach-grid">
              <div className="coach-stat-card">
                <p className="coach-stat-title">
                  Sport
                </p>

                <h3 className="coach-stat-value">
                  {selectedCoach.sport}
                </h3>
              </div>

              <div className="coach-stat-card">
                <p className="coach-stat-title">
                  Experience
                </p>

                <h3 className="coach-stat-value">
                  {selectedCoach.experience}
                </h3>
              </div>

              <div className="coach-stat-card">
                <p className="coach-stat-title">
                  Specialization
                </p>

                <h3 className="coach-stat-value">
                  {selectedCoach.specialization}
                </h3>
              </div>

              <div className="coach-stat-card">
                <p className="coach-stat-title">
                  Total Trainees
                </p>

                <h3 className="coach-stat-value">
                  {selectedCoach.trainees}
                </h3>
              </div>
            </div>

            {/* BIOGRAPHY */}

            <div className="bio-section">
              <h2 className="bio-title">
                Biography
              </h2>

              <p className="bio-text">
                {selectedCoach.bio}
              </p>
            </div>

            {/* AVAILABILITY */}

            <div className="bio-section">
              <h2 className="bio-title">
                Availability
              </h2>

              <p className="bio-text">
                {selectedCoach.availability}
              </p>
            </div>

            {/* BUTTONS */}

            <div className="action-buttons">
              <Link to="/booking">
                <button className="primary-action-btn">
                  Book Training Session
                </button>
              </Link>

              <Link to="/">
                <button className="secondary-action-btn">
                  Back To Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoachDetails;