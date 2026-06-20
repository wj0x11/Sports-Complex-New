import { useParams, Link } from "react-router-dom";
import { findCoachById } from "../services/sports.service";
import "../styles/coachDetails.css";

function CoachDetails() {
  const { id } = useParams();
  const coachId = parseInt(id, 10);

  const { coach: selectedCoach, sport: parentSport } = findCoachById(coachId);

  if (!selectedCoach) {
    return (
      <div className="coach-page">
        <div className="container">
          <h1>Coach Not Found</h1>
          <Link to="/sports">Browse Sports</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="coach-page">
      <div className="container">
        <div className="coach-container">
          <div className="coach-top">
            {selectedCoach.photo && (
              <img
                src={selectedCoach.photo}
                alt={selectedCoach.name}
                className="coach-detail-image"
              />
            )}
            <h1 className="coach-name">{selectedCoach.name}</h1>
            {selectedCoach.position && (
              <p className="coach-position">{selectedCoach.position}</p>
            )}
            <p className="coach-rating">⭐ {selectedCoach.rating} Rating</p>
          </div>

          <div className="coach-content">
            <div className="coach-grid">
              <div className="coach-stat-card">
                <p className="coach-stat-title">Sport</p>
                <h3 className="coach-stat-value">{parentSport?.name}</h3>
              </div>

              <div className="coach-stat-card">
                <p className="coach-stat-title">Experience</p>
                <h3 className="coach-stat-value">{selectedCoach.experience}</h3>
              </div>

              <div className="coach-stat-card">
                <p className="coach-stat-title">Specialization</p>
                <h3 className="coach-stat-value">{selectedCoach.speciality}</h3>
              </div>
            </div>

            <div className="coach-description">
              <h2>About Coach</h2>
              <p>{selectedCoach.description}</p>
            </div>

            {parentSport && (
              <Link
                to={`/sports/${parentSport.slug}`}
                className="coach-book-btn"
              >
                Book with {selectedCoach.name}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoachDetails;
