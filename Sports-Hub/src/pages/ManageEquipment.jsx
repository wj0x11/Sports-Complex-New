import "../styles/manageEquipment.css";

function ManageEquipment() {
  const equipment = [
    {
      id: 1,
      name: "Badminton Racket",
      quantity: 30,
      price: "LKR 300",
      status: "Available",
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea",
    },

    {
      id: 2,
      name: "Shuttlecock Tube",
      quantity: 40,
      price: "LKR 200",
      status: "Available",
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea",
    },

    {
      id: 3,
      name: "Training Cones Set",
      quantity: 20,
      price: "LKR 150",
      status: "Available",
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    },

    {
      id: 4,
      name: "Table Tennis Paddle",
      quantity: 25,
      price: "LKR 250",
      status: "Available",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
    },

    {
      id: 5,
      name: "Table Tennis Ball Set",
      quantity: 35,
      price: "LKR 150",
      status: "Available",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
    },

    {
      id: 6,
      name: "Training Ball Basket",
      quantity: 12,
      price: "LKR 200",
      status: "Available",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
    },

    {
      id: 7,
      name: "Basketball",
      quantity: 25,
      price: "LKR 400",
      status: "Available",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    },

    {
      id: 8,
      name: "Training Bib Set",
      quantity: 15,
      price: "LKR 250",
      status: "Available",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    },

    {
      id: 9,
      name: "Agility Ladder",
      quantity: 10,
      price: "LKR 300",
      status: "Limited",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    },

    {
      id: 10,
      name: "Volleyball",
      quantity: 18,
      price: "LKR 350",
      status: "Available",
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    },

    {
      id: 11,
      name: "Knee Pads",
      quantity: 20,
      price: "LKR 200",
      status: "Available",
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    },

    {
      id: 12,
      name: "Volleyball Training Cones",
      quantity: 15,
      price: "LKR 150",
      status: "Available",
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    },
  ];

  return (
    <div className="manage-equipment-page">
      <div className="container">
        <div className="manage-equipment-header">
          <div>
            <h1 className="manage-equipment-title">Manage Equipment</h1>

            <p className="manage-equipment-subtitle">
              Track equipment availability, rental pricing, and inventory.
            </p>
          </div>

          <button className="add-equipment-btn">Add Equipment</button>
        </div>

        <div className="equipment-grid">
          {equipment.map((item) => (
            <div className="equipment-card" key={item.id}>
              <img
                src={item.image}
                alt={item.name}
                className="equipment-image"
              />

              <div className="equipment-content">
                <h2 className="equipment-name">{item.name}</h2>

                <p className="equipment-info">Quantity: {item.quantity}</p>

                <p className="equipment-info">Rental Price: {item.price}</p>

                <div className="equipment-status">{item.status}</div>

                <div className="equipment-actions">
                  <button className="edit-equipment-btn">Edit</button>

                  <button className="delete-equipment-btn">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageEquipment;
