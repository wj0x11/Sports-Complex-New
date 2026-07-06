import { useState, useEffect } from "react";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { apiClient } from "../services/api/client";
import "../styles/manageEquipment.css";
import { Plus, Edit, Trash2, X } from "lucide-react";

function ManageEquipment() {
  const [equipment, setEquipment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sportSlug: "",
    sportName: "",
    description: "",
    rentalPrice: "",
    totalQuantity: "",
    availableQuantity: "",
    image: "",
    isAvailable: true
  });

  useEffect(() => {
    loadEquipment();
  }, []);

  async function loadEquipment() {
    try {
      const data = await apiClient.getEquipment();
      setEquipment(data);
    } catch (error) {
      console.error("Error loading equipment:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        rentalPrice: Number(formData.rentalPrice),
        totalQuantity: Number(formData.totalQuantity),
        availableQuantity: Number(formData.availableQuantity || formData.totalQuantity)
      };
      
      if (editingItem) {
        await apiClient.updateEquipment(editingItem._id, dataToSend);
      } else {
        await apiClient.createEquipment(dataToSend);
      }
      loadEquipment();
      closeModal();
    } catch (error) {
      console.error("Error saving equipment:", error);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        await apiClient.deleteEquipment(itemId);
        loadEquipment();
      } catch (error) {
        console.error("Error deleting equipment:", error);
      }
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      sportSlug: item.sportSlug || "",
      sportName: item.sportName || "",
      description: item.description || "",
      rentalPrice: item.rentalPrice || "",
      totalQuantity: item.totalQuantity || "",
      availableQuantity: item.availableQuantity || "",
      image: item.image || "",
      isAvailable: item.isAvailable !== false
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      sportSlug: "",
      sportName: "",
      description: "",
      rentalPrice: "",
      totalQuantity: "",
      availableQuantity: "",
      image: "",
      isAvailable: true
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      name: "",
      sportSlug: "",
      sportName: "",
      description: "",
      rentalPrice: "",
      totalQuantity: "",
      availableQuantity: "",
      image: "",
      isAvailable: true
    });
  };

  const getStatus = (item) => {
    if (!item.isAvailable) return "Unavailable";
    if (item.availableQuantity === 0) return "Out of Stock";
    if (item.availableQuantity < 5) return "Limited";
    return "Available";
  };

  return (
    <AdminDashboardLayout
      title="Manage Equipment"
      subtitle="Track equipment availability, rental pricing, and inventory."
    >
      <div className="manage-toolbar">
        <button type="button" className="add-equipment-btn btn-primary" onClick={openAddModal}>
          <Plus size={16} style={{ marginRight: "8px" }} />
          Add Equipment
        </button>
      </div>

      <div className="equipment-grid ui-card-grid">
        {equipment.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
            No equipment found. Add your first item!
          </div>
        ) : (
          equipment.map((item) => (
            <div className="equipment-card ui-card" key={item._id}>
              {item.image && (
                <img src={item.image} alt={item.name} className="equipment-image" />
              )}
              <div className="equipment-content">
                <h2 className="equipment-name">{item.name}</h2>
                <p className="equipment-info">Sport: {item.sportName}</p>
                <p className="equipment-info">Total Quantity: {item.totalQuantity}</p>
                <p className="equipment-info">Available: {item.availableQuantity}</p>
                <p className="equipment-info">Rental Price: LKR {item.rentalPrice?.toLocaleString()}</p>
                <div className={`equipment-status ${getStatus(item).toLowerCase().replace(/ /g, '-')}`}>
                  {getStatus(item)}
                </div>
                <div className="equipment-actions">
                  <button type="button" className="edit-equipment-btn btn-secondary" onClick={() => openEditModal(item)}>
                    <Edit size={14} style={{ marginRight: "6px" }} />
                    Edit
                  </button>
                  <button type="button" className="delete-equipment-btn btn-secondary" onClick={() => handleDelete(item._id)}>
                    <Trash2 size={14} style={{ marginRight: "6px" }} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? "Edit Equipment" : "Add Equipment"}</h2>
              <button type="button" className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Equipment Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Sport Name *</label>
                <input
                  type="text"
                  required
                  value={formData.sportName}
                  onChange={(e) => setFormData({ ...formData, sportName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Sport Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.sportSlug}
                  onChange={(e) => setFormData({ ...formData, sportSlug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="e.g., badminton"
                />
              </div>
              <div className="form-group">
                <label>Rental Price (LKR) *</label>
                <input
                  type="number"
                  required
                  value={formData.rentalPrice}
                  onChange={(e) => setFormData({ ...formData, rentalPrice: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Total Quantity *</label>
                <input
                  type="number"
                  required
                  value={formData.totalQuantity}
                  onChange={(e) => setFormData({ ...formData, totalQuantity: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Available Quantity</label>
                <input
                  type="number"
                  value={formData.availableQuantity}
                  onChange={(e) => setFormData({ ...formData, availableQuantity: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                />
                <label htmlFor="isAvailable">Available for Rent</label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingItem ? "Update Equipment" : "Add Equipment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}

export default ManageEquipment;
