import "../styles/events.css";

function Events() {
  const events = [
    {
      title: "Basketball Championship",

      date: "12 June 2026",

      location: "Main Indoor Arena",

      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    },

    {
      title: "Badminton Tournament",

      date: "18 June 2026",

      location: "Badminton Hall",

      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea",
    },

    {
      title: "Volleyball League",

      date: "24 June 2026",

      location: "Outdoor Court",

      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    },
  ];

  return (
    <div className="events-page">
      <div className="container">
        <div className="events-header">
          <h1 className="events-title">Sports Events</h1>

          <p className="events-subtitle">
            Explore upcoming tournaments, championships, and sports activities
            happening at the complex.
          </p>
        </div>

        <div className="events-grid">
          {events.map((event, index) => (
            <div className="event-card" key={index}>
              <img
                src={event.image}
                alt={event.title}
                className="event-image"
              />

              <div className="event-content">
                <h2 className="event-title">{event.title}</h2>

                <p className="event-info">Date: {event.date}</p>

                <p className="event-info">Location: {event.location}</p>

                <button className="event-btn">Register Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;
