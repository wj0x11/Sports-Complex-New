import AdminDashboardLayout from "../components/AdminDashboardLayout";
import "../styles/manageEquipment.css";

function ManageEquipment() {
  const equipment = [
    {
      id: 1,
      name: "Badminton Racket",
      quantity: 30,
      price: "LKR 750",
      status: "Available",
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600",
    },
    {
      id: 2,
      name: "Shuttlecocks (Pack)",
      quantity: 50,
      price: "LKR 400",
      status: "Available",
      image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600",
    },
    {
      id: 3,
      name: "Table Tennis Paddle",
      quantity: 15,
      price: "LKR 600",
      status: "Limited",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
    },
    {
      id: 4,
      name: "Table Tennis Balls (Pack)",
      quantity: 40,
      price: "LKR 350",
      status: "Available",
      image: "https://images.unsplash.com/photo-1609710227731-04314da89444?w=600",
    },
  ];

  return (
    <AdminDashboardLayout
      title="Manage Equipment"
      subtitle="Track equipment availability, rental pricing, and inventory."
    >
      <div className="manage-toolbar">
        <button type="button" className="add-equipment-btn btn-primary">Add Equipment</button>
      </div>

      <div className="equipment-grid ui-card-grid">
        {equipment.map((item) => (
          <div className="equipment-card ui-card" key={item.id}>
            <img src={item.image} alt={item.name} className="equipment-image" />
            <div className="equipment-content">
              <h2 className="equipment-name">{item.name}</h2>
              <p className="equipment-info">Quantity: {item.quantity}</p>
              <p className="equipment-info">Rental Price: {item.price}</p>
              <div className="equipment-status">{item.status}</div>
              <div className="equipment-actions">
                <button type="button" className="edit-equipment-btn btn-secondary">Edit</button>
                <button type="button" className="delete-equipment-btn btn-secondary">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminDashboardLayout>
  );
}

export default ManageEquipment;
