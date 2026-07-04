import AdminDashboardLayout from "../components/AdminDashboardLayout";
import "../styles/manageCourts.css";

function ManageCourts() {
  const courts = [
    {
      id: 1,
      name: "Badminton Court 1",
      sport: "Badminton",
      price: "LKR 1,500 / hour",
      status: "Available",
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600",
    },
    {
      id: 2,
      name: "Badminton Court 2",
      sport: "Badminton",
      price: "LKR 1,500 / hour",
      status: "Booked",
      image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600",
    },
    {
      id: 3,
      name: "Table Tennis Arena A",
      sport: "Table Tennis",
      price: "LKR 1,200 / hour",
      status: "Available",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
    },
    {
      id: 4,
      name: "Table Tennis Arena B",
      sport: "Table Tennis",
      price: "LKR 1,200 / hour",
      status: "Maintenance",
      image: "https://images.unsplash.com/photo-1609710227731-04314da89444?w=600",
    },
  ];

  return (
    <AdminDashboardLayout
      title="Manage Courts"
      subtitle="Monitor court availability, pricing, and maintenance status."
    >
      <div className="manage-toolbar">
        <button type="button" className="add-court-btn btn-primary">Add New Court</button>
      </div>

      <div className="courts-grid ui-card-grid">
        {courts.map((court) => (
          <div className="court-manage-card ui-card" key={court.id}>
            <img src={court.image} alt={court.name} className="court-manage-image" />
            <div className="court-manage-content">
              <h2 className="court-manage-title">{court.name}</h2>
              <p className="court-manage-info">Sport: {court.sport}</p>
              <p className="court-manage-info">Price: {court.price}</p>
              <div className="court-status">{court.status}</div>
              <div className="manage-court-actions">
                <button type="button" className="edit-court-btn btn-secondary">Edit</button>
                <button type="button" className="delete-court-btn btn-secondary">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminDashboardLayout>
  );
}

export default ManageCourts;
