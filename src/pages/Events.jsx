import { Calendar, MapPin, Users } from "lucide-react";
import "../styles/events.css";

const EVENTS = [
  {
    id: 1,
    title: "Badminton Open Championship",
    date: "12 June 2026",
    time: "9:00 AM – 6:00 PM",
    location: "Badminton Hall A",
    description:
      "Annual singles and doubles tournament open to all skill levels. Register early to secure your spot.",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800",
    featured: true,
    spots: 32,
  },
  {
    id: 2,
    title: "Table Tennis League Finals",
    date: "18 June 2026",
    time: "2:00 PM – 8:00 PM",
    location: "Table Tennis Arena",
    description:
      "Watch the top players compete in the season finale. Spectators welcome with free entry.",
    image: "https://images.unsplash.com/photo-1609710227731-04314da89444?w=800",
    featured: true,
    spots: 16,
  },
  {
    id: 3,
    title: "Junior Coaching Camp",
    date: "24 June 2026",
    time: "8:00 AM – 12:00 PM",
    location: "Training Center",
    description:
      "A week-long intensive coaching camp for junior players aged 10–16. Limited seats available.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
    featured: false,
    spots: 20,
  },
  {
    id: 4,
    title: "Mixed Doubles Tournament",
    date: "2 July 2026",
    time: "10:00 AM – 5:00 PM",
    location: "Badminton Hall B",
    description:
      "Partner up and compete in our popular mixed doubles event. Prizes for top three pairs.",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
    featured: false,
    spots: 24,
  },
];

function Events() {
  const featuredEvents = EVENTS.filter((e) => e.featured);
  const upcomingEvents = EVENTS.filter((e) => !e.featured);

  const handleRegister = (eventTitle) => {
    alert(
      `Registration for "${eventTitle}" will open soon. Please contact reception or check your notifications for updates.`,
    );
  };

  return (
    <div className="events-page page-layout">
      <div className="container">
        <div className="events-header">
          <span className="events-badge">Upcoming Events</span>
          <h1 className="events-title">Sports Events & Tournaments</h1>
          <p className="events-subtitle">
            Explore upcoming tournaments, championships, and coaching activities at
            Battle Blast Sports Complex.
          </p>
        </div>

        {featuredEvents.length > 0 && (
          <section className="events-section">
            <h2 className="events-section-title">Featured Events</h2>
            <div className="events-grid">
              {featuredEvents.map((event) => (
                <article className="event-card ui-card" key={event.id}>
                  <div className="event-image-wrap">
                    <img src={event.image} alt={event.title} className="event-image" />
                    <span className="event-featured-badge">Featured</span>
                  </div>
                  <div className="event-content">
                    <h2 className="event-title">{event.title}</h2>
                    <p className="event-description">{event.description}</p>
                    <div className="event-meta">
                      <span>
                        <Calendar size={14} /> {event.date} · {event.time}
                      </span>
                      <span>
                        <MapPin size={14} /> {event.location}
                      </span>
                      <span>
                        <Users size={14} /> {event.spots} spots
                      </span>
                    </div>
                    <button
                      type="button"
                      className="event-btn btn-primary"
                      onClick={() => handleRegister(event.title)}
                    >
                      Register Now
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="events-section">
          <h2 className="events-section-title">All Upcoming Events</h2>
          <div className="events-grid">
            {[...featuredEvents, ...upcomingEvents].map((event) => (
              <article className="event-card ui-card" key={`all-${event.id}`}>
                <div className="event-image-wrap">
                  <img src={event.image} alt={event.title} className="event-image" />
                </div>
                <div className="event-content">
                  <h2 className="event-title">{event.title}</h2>
                  <div className="event-meta">
                    <span>
                      <Calendar size={14} /> {event.date}
                    </span>
                    <span>
                      <MapPin size={14} /> {event.location}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="event-btn btn-secondary"
                    onClick={() => handleRegister(event.title)}
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Events;
