import AdminDashboardLayout from "../components/AdminDashboardLayout";
import "../styles/manageCoaches.css";

function ManageCoaches() {
  const coaches = [
    {
      id: 1,
      name: "Kasun Perera",
      sport: "Badminton",
      experience: "8 Years",
      rating: "4.9 Rating",
      image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=600",
    },
    {
      id: 2,
      name: "Nimal Silva",
      sport: "Table Tennis",
      experience: "6 Years",
      rating: "4.7 Rating",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600",
    },
    {
      id: 3,
      name: "Ashen Fernando",
      sport: "Badminton",
      experience: "10 Years",
      rating: "5.0 Rating",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600",
    },
    {
      id: 4,
      name: "Dilshan Jayasuriya",
      sport: "Table Tennis",
      experience: "5 Years",
      rating: "4.6 Rating",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600",
    },
  ];

  return (
    <AdminDashboardLayout
      title="Manage Coaches"
      subtitle="Add, update, and manage sports coaches available in the system."
    >
      <div className="manage-toolbar">
        <button type="button" className="add-coach-btn btn-primary">Add New Coach</button>
      </div>

      <div className="coaches-grid ui-card-grid">
        {coaches.map((coach) => (
          <div className="coach-manage-card ui-card" key={coach.id}>
            <img src={coach.image} alt={coach.name} className="coach-manage-image" />
            <div className="coach-manage-content">
              <h2 className="coach-manage-name">{coach.name}</h2>
              <p className="coach-manage-info">Sport: {coach.sport}</p>
              <p className="coach-manage-info">Experience: {coach.experience}</p>
              <div className="coach-rating">{coach.rating}</div>
              <div className="manage-coach-actions">
                <button type="button" className="edit-coach-btn btn-secondary">Edit</button>
                <button type="button" className="delete-coach-btn btn-secondary">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminDashboardLayout>
  );
}

export default ManageCoaches;
