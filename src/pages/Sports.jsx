import { Link } from "react-router-dom";
import { getFeaturedSports } from "../services/sports.service";
import "../styles/sports.css";

function Sports() {
  const featuredSports = getFeaturedSports();

  return (
    <div className="sports-page">
      <div className="container">
        <div className="sports-header">
          <span className="sports-badge">Battle Blast Sports Complex</span>
          <h1>Our Sports</h1>
          <p>
            Explore our professional sports facilities, coaching programs and
            court reservation options.
          </p>
        </div>

        <div className="sports-grid">
          {featuredSports.map((sport) => (
            <div className="sport-card" key={sport.id}>
              <img
                src={sport.image}
                alt={sport.name}
                className="sport-card-image"
                loading="lazy"
              />

              <div className="sport-card-content">
                <span className="sport-category">{sport.category}</span>
                <h3>{sport.name}</h3>
                <p>{sport.description}</p>

                <div className="sport-meta">
                  <span>
                    {sport.type === "court" && sport.courts?.length
                      ? `${sport.courts.length} Facilities`
                      : "Coach Based"}
                  </span>
                  <span>
                    From LKR{" "}
                    {sport.courts?.length
                      ? sport.courts[0].pricePerHour
                      : sport.coaches?.[0]?.price ?? "—"}
                  </span>
                </div>

                <Link to={`/sports/${sport.slug}`} className="view-sport-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sports;
