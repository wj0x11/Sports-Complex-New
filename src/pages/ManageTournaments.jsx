import { useState, useEffect } from "react";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { apiClient } from "../services/api/client";
import "../styles/manageTournaments.css";
import { Plus, Edit, Trash2, X } from "lucide-react";

function ManageTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sportSlug: "",
    sportName: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    maxParticipants: "",
    registrationDeadline: "",
    entryFee: "",
    prizes: [],
    status: "Upcoming"
  });

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const data = await apiClient.getTournaments();
      setTournaments(data);
    } catch (error) {
      console.error("Error loading tournaments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        entryFee: Number(formData.entryFee),
        maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : undefined,
        prizes: formData.prizes ? formData.prizes.split(',').map(p => p.trim()).filter(p => p) : []
      };
      
      if (editingTournament) {
        await apiClient.updateTournament(editingTournament._id, dataToSend);
      } else {
        await apiClient.createTournament(dataToSend);
      }
      loadTournaments();
      closeModal();
    } catch (error) {
      console.error("Error saving tournament:", error);
    }
  };

  const handleDelete = async (tournamentId) => {
    if (window.confirm("Are you sure you want to delete this tournament?")) {
      try {
        await apiClient.deleteTournament(tournamentId);
        loadTournaments();
      } catch (error) {
        console.error("Error deleting tournament:", error);
      }
    }
  };

  const openEditModal = (tournament) => {
    setEditingTournament(tournament);
    setFormData({
      name: tournament.name || "",
      sportSlug: tournament.sportSlug || "",
      sportName: tournament.sportName || "",
      description: tournament.description || "",
      startDate: tournament.startDate ? new Date(tournament.startDate).toISOString().split('T')[0] : "",
      endDate: tournament.endDate ? new Date(tournament.endDate).toISOString().split('T')[0] : "",
      location: tournament.location || "",
      maxParticipants: tournament.maxParticipants || "",
      registrationDeadline: tournament.registrationDeadline ? new Date(tournament.registrationDeadline).toISOString().split('T')[0] : "",
      entryFee: tournament.entryFee || "",
      prizes: tournament.prizes ? tournament.prizes.join(', ') : "",
      status: tournament.status || "Upcoming"
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingTournament(null);
    setFormData({
      name: "",
      sportSlug: "",
      sportName: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      maxParticipants: "",
      registrationDeadline: "",
      entryFee: "",
      prizes: [],
      status: "Upcoming"
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTournament(null);
    setFormData({
      name: "",
      sportSlug: "",
      sportName: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      maxParticipants: "",
      registrationDeadline: "",
      entryFee: "",
      prizes: [],
      status: "Upcoming"
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming': return 'upcoming';
      case 'ongoing': return 'ongoing';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return 'upcoming';
    }
  };

  return (
    <AdminDashboardLayout
      title="Manage Tournaments"
      subtitle="Create, edit, and manage sports tournaments and participant registrations."
    >
      <div className="manage-toolbar">
        <button type="button" className="add-tournament-btn btn-primary" onClick={openAddModal}>
          <Plus size={16} style={{ marginRight: "8px" }} />
          Create Tournament
        </button>
      </div>

      <div className="tournaments-grid ui-card-grid">
        {tournaments.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
            No tournaments found. Create your first tournament!
          </div>
        ) : (
          tournaments.map((tournament) => (
            <div className="tournament-card ui-card" key={tournament._id}>
              <div className="tournament-content">
                <div className="tournament-header">
                  <h2 className="tournament-name">{tournament.name}</h2>
                  <div className={`tournament-status ${getStatusClass(tournament.status)}`}>
                    {tournament.status}
                  </div>
                </div>
                <p className="tournament-info">Sport: {tournament.sportName}</p>
                <p className="tournament-info">
                  Dates: {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                </p>
                {tournament.location && <p className="tournament-info">Location: {tournament.location}</p>}
                {tournament.maxParticipants && (
                  <p className="tournament-info">
                    Participants: {tournament.participants?.length || 0} / {tournament.maxParticipants}
                  </p>
                )}
                {tournament.entryFee > 0 && (
                  <p className="tournament-info">Entry Fee: LKR {tournament.entryFee.toLocaleString()}</p>
                )}
                {tournament.winner && (
                  <p className="tournament-info">Winner: {tournament.winner}</p>
                )}
                <div className="tournament-actions">
                  <button type="button" className="edit-tournament-btn btn-secondary" onClick={() => openEditModal(tournament)}>
                    <Edit size={14} style={{ marginRight: "6px" }} />
                    Edit
                  </button>
                  <button type="button" className="delete-tournament-btn btn-secondary" onClick={() => handleDelete(tournament._id)}>
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
              <h2>{editingTournament ? "Edit Tournament" : "Create Tournament"}</h2>
              <button type="button" className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tournament Name *</label>
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
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Max Participants</label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Registration Deadline</label>
                <input
                  type="date"
                  value={formData.registrationDeadline}
                  onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Entry Fee (LKR)</label>
                <input
                  type="number"
                  value={formData.entryFee}
                  onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Prizes (comma separated)</label>
                <input
                  type="text"
                  value={formData.prizes}
                  onChange={(e) => setFormData({ ...formData, prizes: e.target.value })}
                  placeholder="1st Place - Trophy, 2nd Place - Medal"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingTournament ? "Update Tournament" : "Create Tournament"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}

export default ManageTournaments;
