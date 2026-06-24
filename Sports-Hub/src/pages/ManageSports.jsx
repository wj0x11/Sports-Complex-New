import "../styles/manageSports.css";

function ManageSports() {
  const sports = [
    {
      name: "Badminton",
      image:
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea",
      description:
        "4 professional badminton courts with advanced coaching and premium equipment rentals.",
      courts: "4",
      coaches: "4",
      equipment: "12+",
    },
    {
      name: "Table Tennis",
      image:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
      description:
        "Professional table tennis coaching sessions with structured training programs and indoor facilities.",
      courts: "3",
      coaches: "4",
      equipment: "10+",
    },
    {
      name: "Basketball",
      image:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc",
      description:
        "Professional indoor basketball courts suitable for training sessions and competitive matches.",
      courts: "2",
      coaches: "0",
      equipment: "8+",
    },
    {
      name: "Volleyball",
      image:
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1",
      description:
        "Premium volleyball courts designed for recreational games, team practice sessions, and tournaments.",
      courts: "2",
      coaches: "0",
      equipment: "8+",
    },
  ];

  return (
    <div className="manage-sports-page">
      <div className="container">
        <div className="manage-header">
          <div>
            <h1 className="manage-title">Manage Sports</h1>

            <p className="manage-subtitle">
              Manage courts, coaches, schedules, and sports facilities.
            </p>
          </div>

          <button className="add-sport-btn">Add New Court</button>
        </div>

        <div className="sports-management-grid">
          {sports.map((sport, index) => (
            <div className="manage-sport-card" key={index}>
              <img
                src={sport.image}
                alt={sport.name}
                className="manage-sport-image"
              />

              <div className="manage-sport-content">
                <h2 className="manage-sport-title">{sport.name}</h2>

                <p className="manage-sport-description">
                  {sport.description}
                </p>

                <div className="manage-sport-stats">
                  <div className="sport-stat-box">
                    <h3>{sport.courts}</h3>
                    <span>Courts</span>
                  </div>

                  <div className="sport-stat-box">
                    <h3>{sport.coaches}</h3>
                    <span>Coaches</span>
                  </div>

                  <div className="sport-stat-box">
                    <h3>{sport.equipment}</h3>
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