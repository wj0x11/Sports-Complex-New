import "../styles/ourCoaches.css";

function OurCoaches() {
  const coaches = [
    {
      name: "Kasun Perera",

      role: "Basketball Coach",

      image: "",

      text: "Professional basketball coach with 10 years of coaching experience.",
    },

    {
      name: "Nimal Silva",

      role: "Badminton Coach",

      image: "",

      text: "Certified badminton coach specialized in youth and tournament training.",
    },

    {
      name: "Ashen Fernando",

      role: "Fitness Coach",

      image: "",

      text: "Fitness and conditioning coach helping athletes improve performance.",
    },
  ];

  return (
    <div className="coaches-page">
      <div className="container">
        <div className="coaches-header">
          <h1 className="coaches-title">Our Professional Coaches</h1>

          <p className="coaches-subtitle">
            Meet our experienced and certified sports coaches and fitness
            experts.
          </p>
        </div>

        <div className="coaches-grid">
          {coaches.map((coach, index) => (
            <div className="coach-team-card" key={index}>
              <img
                src={coach.image}
                alt={coach.name}
                className="coach-team-image"
              />

              <div className="coach-team-content">
                <h2 className="coach-team-name">{coach.name}</h2>

                <p className="coach-team-role">{coach.role}</p>

                <p className="coach-team-text">{coach.text}</p>

                <button className="coach-team-btn">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OurCoaches;
