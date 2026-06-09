import "../styles/manageCourts.css";

function ManageCourts() {
  const courts = [
    {
      id: 1,

      name: "Basketball Court A",

      sport: "Basketball",

      price: "LKR 2,500 / hour",

      status: "Available",

      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    },

    {
      id: 2,

      name: "Volleyball Court",

      sport: "Volleyball",

      price: "LKR 3,000 / hour",

      status: "Booked",

      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    },

    {
      id: 3,

      name: "Badminton Court 1",

      sport: "Badminton",

      price: "LKR 1,500 / hour",

      status: "Available",

      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea",
    },

    {
      id: 4,

      name: "Table Tennis Arena",

      sport: "Table Tennis",

      price: "LKR 1,200 / hour",

      status: "Maintenance",

      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
    },
  ];

  return (
    <div className="manage-courts-page">
      <div className="container">
        <div className="manage-courts-header">
          <div>
            <h1 className="manage-courts-title">Manage Courts</h1>

            <p className="manage-courts-subtitle">
              Monitor court availability, pricing, and maintenance status.
            </p>
          </div>

          <button className="add-court-btn">Add New Court</button>
        </div>

        <div className="courts-grid">
          {courts.map((court) => (
            <div className="court-manage-card" key={court.id}>
              <img
                src={court.image}
                alt={court.name}
                className="court-manage-image"
              />

              <div className="court-manage-content">
                <h2 className="court-manage-title">{court.name}</h2>

                <p className="court-manage-info">Sport: {court.sport}</p>

                <p className="court-manage-info">Price: {court.price}</p>

                <div className="court-status">{court.status}</div>

                <div className="manage-court-actions">
                  <button className="edit-court-btn">Edit</button>

                  <button className="delete-court-btn">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageCourts;
