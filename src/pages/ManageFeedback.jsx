import { useState, useEffect } from "react";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { apiClient } from "../services/api/client";
import "../styles/manageFeedback.css";
import { Edit, Trash2, X, MessageSquare, Star } from "lucide-react";

function ManageFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [formData, setFormData] = useState({
    adminReply: "",
    isVisible: true
  });

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const data = await apiClient.getFeedback();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error loading feedbacks:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFeedback) {
        await apiClient.updateFeedback(editingFeedback._id, formData);
      }
      loadFeedbacks();
      closeModal();
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  };

  const handleDelete = async (feedbackId) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await apiClient.deleteFeedback(feedbackId);
        loadFeedbacks();
      } catch (error) {
        console.error("Error deleting feedback:", error);
      }
    }
  };

  const openReplyModal = (feedback) => {
    setEditingFeedback(feedback);
    setFormData({
      adminReply: feedback.adminReply || "",
      isVisible: feedback.isVisible !== false
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFeedback(null);
    setFormData({
      adminReply: "",
      isVisible: true
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? "#fbbf24" : "none"}
        color={i < rating ? "#fbbf24" : "#cbd5e1"}
      />
    ));
  };

  return (
    <AdminDashboardLayout
      title="Manage Feedback"
      subtitle="View and respond to customer feedback and reviews."
    >
      <div className="feedback-grid">
        {feedbacks.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
            No feedback found yet.
          </div>
        ) : (
          feedbacks.map((feedback) => (
            <div className="feedback-card ui-card" key={feedback._id}>
              <div className="feedback-header">
                <div className="feedback-user">
                  <div className="feedback-avatar">
                    {(feedback.userName || feedback.userEmail || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{feedback.userName || "Anonymous"}</h3>
                    <span>{feedback.userEmail}</span>
                  </div>
                </div>
                <div className="feedback-rating">
                  {renderStars(feedback.rating)}
                </div>
              </div>
              <p className="feedback-date">{formatDate(feedback.createdAt)}</p>
              <p className="feedback-comment">{feedback.comment}</p>
              {feedback.adminReply && (
                <div className="admin-reply">
                  <div className="admin-reply-header">
                    <MessageSquare size={16} />
                    <span>Admin Reply</span>
                  </div>
                  <p>{feedback.adminReply}</p>
                </div>
              )}
              <div className="feedback-actions">
                <button type="button" className="reply-btn btn-secondary" onClick={() => openReplyModal(feedback)}>
                  <Edit size={14} style={{ marginRight: "6px" }} />
                  {feedback.adminReply ? "Edit Reply" : "Reply"}
                </button>
                <button type="button" className="delete-btn btn-secondary" onClick={() => handleDelete(feedback._id)}>
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
              <h2>{editingFeedback?.adminReply ? "Edit Reply" : "Reply to Feedback"}</h2>
              <button type="button" className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Admin Reply</label>
                <textarea
                  value={formData.adminReply}
                  onChange={(e) => setFormData({ ...formData, adminReply: e.target.value })}
                  placeholder="Write your reply to this feedback..."
                  rows={4}
                />
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                />
                <label htmlFor="isVisible">Visible to public</label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">
                  Save Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}

export default ManageFeedback;
