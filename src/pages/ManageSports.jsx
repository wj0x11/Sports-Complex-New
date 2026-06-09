import "../styles/manageSports.css";

function ManageSports() {
  return (
    <div className="manage-sports-page">
      <div className="container">
        <div className="manage-header">
          <div>
            <h1 className="manage-title">Manage Sports</h1>

            <p className="manage-subtitle">
              Manage badminton courts, coaches, schedules, and equipment.
            </p>
          </div>

          <button className="add-sport-btn">Add New Court</button>
        </div>

        <div className="sports-management-grid">
          <div className="manage-sport-card">
            <img
              src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea"
              alt="Badminton"
              className="manage-sport-image"
            />

            <div className="manage-sport-content">
              <h2 className="manage-sport-title">Badminton</h2>

              <p className="manage-sport-description">
                4 professional badminton courts with advanced coaching and
                premium equipment rentals.
              </p>

              <div className="manage-sport-stats">
                <div className="sport-stat-box">
                  <h3>4</h3>

                  <span>Courts</span>
                </div>

                <div className="sport-stat-box">
                  <h3>3</h3>

                  <span>Coaches</span>
                </div>

                <div className="sport-stat-box">
                  <h3>12+</h3>

                  <span>Equipment</span>
                </div>
              </div>

              <div className="manage-sport-actions">
                <button className="edit-btn">Manage</button>

                <button className="delete-btn">Disable</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageSports;
