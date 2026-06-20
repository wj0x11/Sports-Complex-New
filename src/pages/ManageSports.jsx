import { getAdminSportSummaries } from "../services/sports.service";
import "../styles/manageSports.css";

function ManageSports() {
  const sports = getAdminSportSummaries();

  return (
    <div className="manage-sports-page">
      <div className="container">
        <div className="manage-header">
          <div>
            <h1 className="manage-title">Manage Sports</h1>
            <p className="manage-subtitle">
              Manage courts, coaches, schedules, and equipment across all sports
              facilities.
            </p>
          </div>

          <button className="add-sport-btn">Add New Sport</button>
        </div>

        <div className="sports-management-grid">
          {sports.map((sport) => (
            <div className="manage-sport-card" key={sport.id}>
              <img
                src={sport.image}
                alt={sport.name}
                className="manage-sport-image"
              />

              <div className="manage-sport-content">
                <span className="sport-tag">
                  {sport.featured ? "Featured" : "Standard"} · {sport.type}
                </span>
                <h2 className="manage-sport-title">{sport.name}</h2>
                <p className="manage-sport-description">{sport.description}</p>

                <div className="manage-sport-stats">
                  <div className="sport-stat-box">
                    <h3>{sport.courtsCount}</h3>
                    <span>{sport.type === "court" ? "Facilities" : "Sessions"}</span>
                  </div>

                  <div className="sport-stat-box">
                    <h3>{sport.coachesCount}</h3>
                    <span>Coaches</span>
                  </div>

                  <div className="sport-stat-box">
                    <h3>{sport.equipmentCount}</h3>
                    <span>Equipment</span>
                  </div>
                </div>

                <div className="manage-sport-actions">
                  <button className="edit-btn">Manage</button>
                  <button className="delete-btn">Disable</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageSports;
