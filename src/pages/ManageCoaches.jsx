import { useState, useEffect } from "react";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { apiClient } from "../services/api/client";
import "../styles/manageCoaches.css";
import { Plus, Edit, Trash2, X } from "lucide-react";

function ManageCoaches() {
  const [coaches, setCoaches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    sportSlug: "",
    sportName: "",
    experience: "",
    specialization: "",
    rating: 0,
    pricePerSession: "",
    bio: "",
    avatar: "",
    isAvailable: true
  });

  useEffect(() => {
    loadCoaches();
  }, []);

  const loadCoaches = async () => {
    try {
      const data = await apiClient.getCoaches();
      setCoaches(data);
    } catch (error) {
      console.error("Error loading coaches:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCoach) {
        await apiClient.updateCoach(editingCoach._id, formData);
      } else {
        await apiClient.createCoach(formData);
      }
      loadCoaches();
      closeModal();
    } catch (error) {
      console.error("Error saving coach:", error);
    }
  };

  const handleDelete = async (coachId) => {
    if (window.confirm("Are you sure you want to delete this coach?")) {
      try {
        await apiClient.deleteCoach(coachId);
        loadCoaches();
      } catch (error) {
        console.error("Error deleting coach:", error);
      }
    }
  };

  const openEditModal = (coach) => {
    setEditingCoach(coach);
    setFormData({
      fullName: coach.fullName || "",
      email: coach.email || "",
      phone: coach.phone || "",
      sportSlug: coach.sportSlug || "",
      sportName: coach.sportName || "",
      experience: coach.experience || "",
      specialization: coach.specialization || "",
      rating: coach.rating || 0,
      pricePerSession: coach.pricePerSession || "",
      bio: coach.bio || "",
      avatar: coach.avatar || "",
      isAvailable: coach.isAvailable !== false
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingCoach(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      sportSlug: "",
      sportName: "",
      experience: "",
      specialization: "",
      rating: 0,
      pricePerSession: "",
      bio: "",
      avatar: "",
      isAvailable: true
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCoach(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      sportSlug: "",
      sportName: "",
      experience: "",
      specialization: "",
      rating: 0,
      pricePerSession: "",
      bio: "",
      avatar: "",
      isAvailable: true
    });
  };

  return (
    <AdminDashboardLayout
      title="Manage Coaches"
      subtitle="Add, update, and manage sports coaches available in the system."
    >
      <div className="manage-toolbar">
        <button type="button" className="add-coach-btn btn-primary" onClick={openAddModal}>
          <Plus size={16} style={{ marginRight: "8px" }} />
          Add New Coach
        </button>
      </div>

      <div className="coaches-grid ui-card-grid">
        {coaches.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
            No coaches found. Add your first coach!
          </div>
        ) : (
          coaches.map((coach) => (
            <div className="coach-manage-card ui-card" key={coach._id}>
              {coach.avatar && (
                <img src={coach.avatar} alt={coach.fullName} className="coach-manage-image" />
              )}
              <div className="coach-manage-content">
                <h2 className="coach-manage-name">{coach.fullName}</h2>
                <p className="coach-manage-info">Sport: {coach.sportName}</p>
                <p className="coach-manage-info">Experience: {coach.experience}</p>
                <p className="coach-manage-info">Price: LKR {coach.pricePerSession?.toLocaleString()} / session</p>
                <div className="coach-rating">
                  {coach.rating ? `${coach.rating} Rating` : "No rating"}
                </div>
                <div className="coach-status">
                  {coach.isAvailable ? "Available" : "Unavailable"}
                </div>
                <div className="manage-coach-actions">
                  <button type="button" className="edit-coach-btn btn-secondary" onClick={() => openEditModal(coach)}>
                    <Edit size={14} style={{ marginRight: "6px" }} />
                    Edit
                  </button>
                  <button type="button" className="delete-coach-btn btn-secondary" onClick={() => handleDelete(coach._id)}>
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
              <h2>{editingCoach ? "Edit Coach" : "Add New Coach"}</h2>
              <button type="button" className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                <label>Price per Session (LKR) *</label>
                <input
                  type="number"
                  required
                  value={formData.pricePerSession}
                  onChange={(e) => setFormData({ ...formData, pricePerSession: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g., 8 years"
                />
              </div>
              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Rating (0-5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Avatar URL</label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
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
                <label htmlFor="isAvailable">Available</label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingCoach ? "Update Coach" : "Add Coach"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}

export default ManageCoaches;
