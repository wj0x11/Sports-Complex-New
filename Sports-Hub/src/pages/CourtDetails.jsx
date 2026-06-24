import { useParams, Link } from "react-router-dom";

import sportsData from "../data/sportsData";

import "../styles/courtDetails.css";

function CourtDetails() {
  const { id } = useParams();

  let selectedCourt = null;

  sportsData.forEach((sport) => {
    const foundCourt = sport.courts.find(
      (court) => court.id === parseInt(id)
    );

    if (foundCourt) {
      selectedCourt = foundCourt;
    }
  });

  if (!selectedCourt) {
    return (
      <div className="container">
        <h1>Court Not Found</h1>
      </div>
    );
  }

  return (
    <div className="court-page">
      <div className="container">
        <div className="court-container">

          <div className="court-top">
            <h1 className="court-name">
              {selectedCourt.name}
            </h1>

            <p className="court-status">
              {selectedCourt.status}
            </p>
          </div>


          <div className="court-content">

            <div className="court-grid">
              <div className="court-card">
                <p className="court-card-title">
                  Court Type
                </p>

                <h3 className="court-card-value">
                  {selectedCourt.type}
                </h3>
              </div>

              <div className="court-card">
                <p className="court-card-title">
                  Price Per Hour
                </p>

                <h3 className="court-card-value">
                  ${selectedCourt.price}
                </h3>
              </div>

              <div className="court-card">
                <p className="court-card-title">
                  Capacity
                </p>

                <h3 className="court-card-value">
                  {selectedCourt.capacity}
                </h3>
              </div>

              <div className="court-card">
                <p className="court-card-title">
                  Availability
                </p>

                <h3 className="court-card-value">
                  {selectedCourt.availability}
                </h3>
              </div>
            </div>


            <div className="facilities-section">
              <h2 className="facilities-title">
                Facilities
              </h2>

              <div className="facilities-list">
                {selectedCourt.facilities.map(
                  (facility, index) => (
                    <div
                      className="facility-badge"
                      key={index}
                    >
                      {facility}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="booking-buttons">
              <Link to="/booking-form">
                <button className="book-btn">
                  Book Court
                </button>
              </Link>

              <Link to="/">
                <button className="back-btn">
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

export default CourtDetails;