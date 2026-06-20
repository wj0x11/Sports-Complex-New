import { useParams, Link } from "react-router-dom";
import { findCourtById } from "../services/sports.service";
import "../styles/courtDetails.css";

function CourtDetails() {
  const { id } = useParams();
  const courtId = parseInt(id, 10);

  const { court: selectedCourt, sport: parentSport } = findCourtById(courtId);

  if (!selectedCourt) {
    return (
      <div className="court-page">
        <div className="container">
          <h1>Court Not Found</h1>
          <Link to="/sports">Browse Sports</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="court-page">
      <div className="container">
        <div className="court-container">
          <div className="court-top">
            <h1 className="court-name">{selectedCourt.name}</h1>
            {parentSport && (
              <p className="court-status">{parentSport.name}</p>
            )}
          </div>

          <div className="court-content">
            <div className="court-grid">
              <div className="court-card">
                <p className="court-card-title">Sport</p>
                <h3 className="court-card-value">{parentSport?.name}</h3>
              </div>

              <div className="court-card">
                <p className="court-card-title">Price Per Hour</p>
                <h3 className="court-card-value">
                  LKR {selectedCourt.pricePerHour}
                </h3>
              </div>

              <div className="court-card">
                <p className="court-card-title">Capacity</p>
                <h3 className="court-card-value">{selectedCourt.capacity}</h3>
              </div>
            </div>

            {parentSport && (
              <div className="booking-buttons">
                <Link to={`/sports/${parentSport.slug}`}>
                  <button className="book-btn">Book This Facility</button>
                </Link>

                <Link to="/sports">
                  <button className="back-btn">Back To Sports</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourtDetails;
