import { useState, useEffect } from "react";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { apiClient } from "../services/api/client";
import "../styles/manageMemberships.css";
import { Plus, Edit, Trash2, X, CheckCircle2 } from "lucide-react";

const defaultStartDate = new Date().toISOString().split('T')[0];
const defaultEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

function ManageMemberships() {
  const [memberships, setMemberships] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    userEmail: "",
    userName: "",
    type: "Bronze",
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    price: 0,
    status: "Active",
    features: []
  });

  const membershipTypes = [
    { name: "Bronze", price: 5000, features: ["Unlimited Badminton", "Free Water", "10% Off Coaching"] },
    { name: "Silver", price: 10000, features: ["Unlimited All Sports", "Free Water", "20% Off Coaching", "Priority Booking"] },
    { name: "Gold", price: 20000, features: ["Unlimited All Sports", "Free Water & Snacks", "30% Off Coaching", "Priority Booking", "Free Equipment Rental"] }
  ];

  const loadMemberships = async () => {
    try {
      const data = await apiClient.getMemberships();
      setMemberships(data);
    } catch (error) {
      console.error("Error loading memberships:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchMemberships = async () => {
      try {
        const data = await apiClient.getMemberships();
        if (isMounted) {
          setMemberships(data);
        }
      } catch (error) {
        console.error("Error loading memberships:", error);
      }
    };

    fetchMemberships();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTypeChange = (type) => {
    const selectedType = membershipTypes.find(t => t.name === type);
    if (selectedType) {
      setFormData({
        ...formData,
        type,
        price: selectedType.price,
        features: selectedType.features
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMembership) {
        await apiClient.updateMembership(editingMembership._id, formData);
      } else {
        await apiClient.createMembership(formData);
      }
      loadMemberships();
      closeModal();
    } catch (error) {
      console.error("Error saving membership:", error);
    }
  };

  const handleDelete = async (membershipId) => {
    if (window.confirm("Are you sure you want to delete this membership?")) {
      try {
        await apiClient.deleteMembership(membershipId);
        loadMemberships();
      } catch (error) {
        console.error("Error deleting membership:", error);
      }
    }
  };

  const openEditModal = (membership) => {
    setEditingMembership(membership);
    setFormData({
      userId: membership.userId || "",
      userEmail: membership.userEmail || "",
      userName: membership.userName || "",
      type: membership.type || "Bronze",
      startDate: membership.startDate ? new Date(membership.startDate).toISOString().split('T')[0] : "",
      endDate: membership.endDate ? new Date(membership.endDate).toISOString().split('T')[0] : "",
      price: membership.price || 0,
      status: membership.status || "Active",
      features: membership.features || []
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingMembership(null);
    setFormData({
      userId: "",
      userEmail: "",
      userName: "",
      type: "Bronze",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: 5000,
      status: "Active",
      features: membershipTypes.find(t => t.name === "Bronze").features
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMembership(null);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "active-status";
      case "Expired":
        return "expired-status";
      case "Cancelled":
        return "cancelled-status";
      default:
        return "pending-status";
    }
  };

  return (
    <AdminDashboardLayout
      title="Manage Memberships"
      subtitle="Manage customer memberships and track active subscriptions."
    >
      <div className="manage-toolbar">
        <button type="button" className="add-membership-btn btn-primary" onClick={openAddModal}>
          <Plus size={16} style={{ marginRight: "8px" }} />
          Add Membership
        </button>
      </div>

      <div className="memberships-grid ui-card-grid">
        {memberships.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
            No memberships found yet.
          </div>
        ) : (
          memberships.map((membership) => (
            <div className="membership-card ui-card" key={membership._id}>
              <div className="membership-header">
                <h2 className={`membership-title membership-${membership.type?.toLowerCase()}`}>
                  {membership.type}
                </h2>
                <span className={`membership-status ${getStatusClass(membership.status)}`}>
                  {membership.status}
                </span>
              </div>
              <div className="membership-details">
                <p><strong>Member:</strong> {membership.userName || "Unknown"}</p>
                <p><strong>Email:</strong> {membership.userEmail}</p>
                <p><strong>Valid:</strong> {formatDate(membership.startDate)} - {formatDate(membership.endDate)}</p>
                <p><strong>Price:</strong> LKR {membership.price?.toLocaleString()}</p>
                {membership.features?.length > 0 && (
                  <div className="features-list">
                    <strong>Features:</strong>
                    <ul>
                      {membership.features.map((feature, idx) => (
                        <li key={idx}><CheckCircle2 size={14} style={{ marginRight: "6px", color: "#84cc16" }} /> {feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="membership-actions">
                <button type="button" className="edit-membership-btn btn-secondary" onClick={() => openEditModal(membership)}>
                  <Edit size={14} style={{ marginRight: "6px" }} />
                  Edit
                </button>
                <button type="button" className="delete-membership-btn btn-secondary" onClick={() => handleDelete(membership._id)}>
                  <Trash2 size={14} style={{ marginRight: "6px" }} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingMembership ? "Edit Membership" : "Add Membership"}</h2>
              <button type="button" className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Member Name</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  placeholder="Member's name"
                />
              </div>
              <div className="form-group">
                <label>Member Email *</label>
                <input
                  type="email"
                  required
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  placeholder="member@email.com"
                />
              </div>
              <div className="form-group">
                <label>Membership Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                >
                  {membershipTypes.map(type => (
                    <option key={type.name} value={type.name}>
                      {type.name} - LKR {type.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>End Date *</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingMembership ? "Update Membership" : "Add Membership"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}

export default ManageMemberships;
