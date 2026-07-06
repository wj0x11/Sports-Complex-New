import { useState, useEffect } from "react";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { apiClient } from "../services/api/client";
import "../styles/manageTrainingSessions.css";
import { Plus, Edit, Trash2, X, Users, Clock } from "lucide-react";

function ManageTrainingSessions() {
  const [sessions, setSessions] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    coachId: "",
    coachName: "",
    sportSlug: "",
    sportName: "",
    date: "",
    time: "",
    duration: "",
    players: [],
    notes: ""
  });

  const loadSessions = async () => {
    try {
      const data = await apiClient.getTrainingSessions();
      setSessions(data);
    } catch (error) {
      console.error("Error loading training sessions:", error);
    }
  };

  const loadCoaches = async () => {
    try {
      const data = await apiClient.getCoaches();
      setCoaches(data);
    } catch (error) {
      console.error("Error loading coaches:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadSessions();
      await loadCoaches();
    };

    initialize();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        date: new Date(formData.date)
      };
      
      if (editingSession) {
        await apiClient.updateTrainingSession(editingSession._id, dataToSend);
      } else {
        await apiClient.createTrainingSession(dataToSend);
      }
      loadSessions();
      closeModal();
    } catch (error) {
      console.error("Error saving training session:", error);
    }
  };

  const handleDelete = async (sessionId) => {
    if (window.confirm("Are you sure you want to delete this training session?")) {
      try {
        await apiClient.deleteTrainingSession(sessionId);
        loadSessions();
      } catch (error) {
        console.error("Error deleting training session:", error);
      }
    }
  };

  const handleCoachChange = (e) => {
    const coachId = e.target.value;
    const selectedCoach = coaches.find(c => c._id === coachId);
    if (selectedCoach) {
      setFormData({
        ...formData,
        coachId: selectedCoach._id,
        coachName: selectedCoach.fullName,
        sportSlug: selectedCoach.sportSlug,
        sportName: selectedCoach.sportName
      });
    }
  };

  const openEditModal = (session) => {
    setEditingSession(session);
    setFormData({
      coachId: session.coachId || "",
      coachName: session.coachName || "",
      sportSlug: session.sportSlug || "",
      sportName: session.sportName || "",
      date: session.date ? new Date(session.date).toISOString().split('T')[0] : "",
      time: session.time || "",
      duration: session.duration || "",
      players: session.players || [],
      notes: session.notes || ""
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingSession(null);
    setFormData({
      coachId: "",
      coachName: "",
      sportSlug: "",
      sportName: "",
      date: "",
      time: "",
      duration: "",
      players: [],
      notes: ""
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSession(null);
    setFormData({
      coachId: "",
      coachName: "",
      sportSlug: "",
      sportName: "",
      date: "",
      time: "",
      duration: "",
      players: [],
      notes: ""
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <AdminDashboardLayout
      title="Manage Training Sessions"
      subtitle="Schedule, edit, and manage training sessions with coaches and players."
    >
      <div className="manage-toolbar">
        <button type="button" className="add-session-btn btn-primary" onClick={openAddModal}>
          <Plus size={16} style={{ marginRight: "8px" }} />
          Schedule Session
        </button>
      </div>

      <div className="sessions-grid">
        {sessions.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
            No training sessions scheduled yet.
          </div>
        ) : (
          sessions.map((session) => (
            <div className="session-card ui-card" key={session._id}>
              <div className="session-header">
                <h2 className="session-sport">{session.sportName}</h2>
                <div className="session-time">
                  <Clock size={14} style={{ marginRight: "6px" }} />
                  {formatDate(session.date)} at {session.time}
                </div>
              </div>
              <p className="session-coach">Coach: {session.coachName}</p>
              {session.duration && <p className="session-duration">Duration: {session.duration}</p>}
              {session.players && session.players.length > 0 && (
                <div className="session-players">
                  <div className="session-players-header">
                    <Users size={16} style={{ marginRight: "8px" }} />
                    <span>Players ({session.players.length})</span>
                  </div>
                  <div className="players-list">
                    {session.players.map((player, idx) => (
                      <div key={idx} className="player-item">
                        <span>{player.name || player.email}</span>
                        {player.attendance && (
                          <span className={`player-attendance ${player.attendance.toLowerCase()}`}>
                            {player.attendance}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {session.notes && <p className="session-notes">Notes: {session.notes}</p>}
              <div className="session-actions">
                <button type="button" className="edit-session-btn btn-secondary" onClick={() => openEditModal(session)}>
                  <Edit size={14} style={{ marginRight: "6px" }} />
                  Edit
                </button>
                <button type="button" className="delete-session-btn btn-secondary" onClick={() => handleDelete(session._id)}>
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
              <h2>{editingSession ? "Edit Training Session" : "Schedule Training Session"}</h2>
              <button type="button" className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Coach *</label>
                <select
                  required
                  value={formData.coachId}
                  onChange={handleCoachChange}
                >
                  <option value="">Select a coach</option>
                  {coaches.map(coach => (
                    <option key={coach._id} value={coach._id}>
                      {coach.fullName} - {coach.sportName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 1 hour, 90 minutes"
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingSession ? "Update Session" : "Schedule Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}

export default ManageTrainingSessions;
