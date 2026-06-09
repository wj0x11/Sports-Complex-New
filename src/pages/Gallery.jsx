import "../styles/gallery.css";

function Gallery() {
  const images = [
    {
      title: "Basketball Arena",

      image:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    },

    {
      title: "Badminton Court",

      image:
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea",
    },

    {
      title: "Volleyball Training",

      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    },

    {
      title: "Fitness Area",

      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    },

    {
      title: "Coaching Session",

      image:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a",
    },

    {
      title: "Tournament Event",

      image:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
    },
  ];

  return (
    <div className="gallery-page">
      <div className="container">
        <div className="gallery-header">
          <h1 className="gallery-title">
            Sports Gallery
          </h1>

          <p className="gallery-subtitle">
            Explore our sports facilities,
            training sessions, tournaments, and
            premium sports environments.
          </p>
        </div>

        <div className="gallery-grid">
          {images.map((item, index) => (
            <div
              className="gallery-card"
              key={index}
            >
              <img
                src={item.image}
                alt={item.title}
                className="gallery-image"
              />

              <div className="gallery-overlay">
                <h2>{item.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Gallery;