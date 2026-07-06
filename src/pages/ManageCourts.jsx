import { useState, useEffect } from "react";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { apiClient } from "../services/api/client";
import "../styles/manageCourts.css";
import { Plus, Edit, Trash2, X } from "lucide-react";

function ManageCourts() {
  const [courts, setCourts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sportSlug: "",
    sportName: "",
    description: "",
    pricePerHour: "",
    capacity: "",
    images: [],
    location: "",
    isAvailable: true,
    isUnderMaintenance: false
  });

  const loadCourts = async () => {
    try {
      const data = await apiClient.getCourts();
      setCourts(data);
    } catch (error) {
      console.error("Error loading courts:", error);
    }
  };

  useEffect(() => {
    const initializeCourts = async () => {
      try {
        const data = await apiClient.getCourts();
        setCourts(data);
      } catch (error) {
        console.error("Error loading courts:", error);
      }
    };

    initializeCourts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourt) {
        await apiClient.updateCourt(editingCourt._id, formData);
      } else {
        await apiClient.createCourt(formData);
      }
      loadCourts();
      closeModal();
    } catch (error) {
      console.error("Error saving court:", error);
    }
  };

  const handleDelete = async (courtId) => {
    if (window.confirm("Are you sure you want to delete this court?")) {
      try {
        await apiClient.deleteCourt(courtId);
        loadCourts();
      } catch (error) {
        console.error("Error deleting court:", error);
      }
    }
  };

  const openEditModal = (court) => {
    setEditingCourt(court);
    setFormData({
      name: court.name || "",
      sportSlug: court.sportSlug || "",
      sportName: court.sportName || "",
      description: court.description || "",
      pricePerHour: court.pricePerHour || "",
      capacity: court.capacity || "",
      images: court.images || [],
      location: court.location || "",
      isAvailable: court.isAvailable !== false,
      isUnderMaintenance: court.isUnderMaintenance || false
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingCourt(null);
    setFormData({
      name: "",
      sportSlug: "",
      sportName: "",
      description: "",
      pricePerHour: "",
      capacity: "",
      images: [],
      location: "",
      isAvailable: true,
      isUnderMaintenance: false
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourt(null);
    setFormData({
      name: "",
      sportSlug: "",
      sportName: "",
      description: "",
      pricePerHour: "",
      capacity: "",
      images: [],
      location: "",
      isAvailable: true,
      isUnderMaintenance: false
    });
  };

  return (
    <AdminDashboardLayout
      title="Manage Courts"
      subtitle="Monitor court availability, pricing, and maintenance status."
    >
      <div className="manage-toolbar">
        <button type="button" className="add-court-btn btn-primary" onClick={openAddModal}>
          <Plus size={16} style={{ marginRight: "8px" }} />
          Add New Court
        </button>
      </div>

      <div className="courts-grid ui-card-grid">
        {courts.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
            No courts found. Add your first court!
          </div>
        ) : (
          courts.map((court) => (
            <div className="court-manage-card ui-card" key={court._id}>
              {court.images?.[0] && (
                <img src={court.images[0]} alt={court.name} className="court-manage-image" />
              )}
              <div className="court-manage-content">
                <h2 className="court-manage-title">{court.name}</h2>
                <p className="court-manage-info">Sport: {court.sportName}</p>
                <p className="court-manage-info">Price: LKR {court.pricePerHour?.toLocaleString()} / hour</p>
                {court.capacity && <p className="court-manage-info">Capacity: {court.capacity}</p>}
                {court.location && <p className="court-manage-info">Location: {court.location}</p>}
                <div className={`court-status ${court.isUnderMaintenance ? 'maintenance' : court.isAvailable ? 'available' : 'booked'}`}>
                  {court.isUnderMaintenance ? "Maintenance" : court.isAvailable ? "Available" : "Unavailable"}
                </div>
                <div className="manage-court-actions">
                  <button type="button" className="edit-court-btn btn-secondary" onClick={() => openEditModal(court)}>
                    <Edit size={14} style={{ marginRight: "6px" }} />
                    Edit
                  </button>
                  <button type="button" className="delete-court-btn btn-secondary" onClick={() => handleDelete(court._id)}>
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
              <h2>{editingCourt ? "Edit Court" : "Add New Court"}</h2>
              <button type="button" className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Court Name *</label>
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
                <label>Price per Hour (LKR) *</label>
                <input
                  type="number"
                  required
                  value={formData.pricePerHour}
                  onChange={(e) => setFormData({ ...formData, pricePerHour: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="text"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                  value={formData.images?.[0] || ""}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value ? [e.target.value] : [] })}
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
                <label htmlFor="isAvailable">Available for booking</label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="isUnderMaintenance"
                  checked={formData.isUnderMaintenance}
                  onChange={(e) => setFormData({ ...formData, isUnderMaintenance: e.target.checked })}
                />
                <label htmlFor="isUnderMaintenance">Under maintenance</label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingCourt ? "Update Court" : "Add Court"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}

export default ManageCourts;
