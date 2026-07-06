import { useState, useEffect } from "react";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { apiClient } from "../services/api/client";
import "../styles/sendNotifications.css";
import { Plus, Send, X, CheckCircle2, Bell } from "lucide-react";

function SendNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    recipientType: "all",
    recipientEmail: "",
    isRead: false
  });

  const loadNotifications = async () => {
    try {
      const data = await apiClient.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await apiClient.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const notificationData = {
        ...formData,
        sentAt: new Date(),
        isRead: false
      };
      
      if (formData.recipientType === "all") {
        // Send to all users - we can send one notification with recipientType all
        await apiClient.createNotification(notificationData);
      } else {
        // Send to specific email
        await apiClient.createNotification({
          ...notificationData,
          email: formData.recipientEmail
        });
      }
      
      loadNotifications();
      closeModal();
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const openModal = () => {
    setFormData({
      title: "",
      message: "",
      recipientType: "all",
      recipientEmail: "",
      isRead: false
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminDashboardLayout
      title="Send Notifications"
      subtitle="Send notifications to all users or specific members."
    >
      <div className="manage-toolbar">
        <button type="button" className="send-notification-btn btn-primary" onClick={openModal}>
          <Plus size={16} style={{ marginRight: "8px" }} />
          Send Notification
        </button>
      </div>

      <div className="notifications-grid ui-card-grid">
        {notifications.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
            No notifications sent yet.
          </div>
        ) : (
          notifications.map((notification) => (
            <div className="notification-card ui-card" key={notification._id}>
              <div className="notification-header">
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div className={`notification-icon ${notification.isRead ? "read" : "unread"}`}>
                    <Bell size={20} />
                  </div>
                  <div>
                    <h2 className="notification-title">{notification.title}</h2>
                    <p className="notification-date">{formatDate(notification.sentAt)}</p>
                  </div>
                </div>
                {notification.isRead && (
                  <span className="read-badge"><CheckCircle2 size={14} /> Read</span>
                )}
              </div>
              <p className="notification-message">{notification.message}</p>
              {notification.email && (
                <p className="notification-recipient">
                  Sent to: <strong>{notification.email}</strong>
                </p>
              )}
              {notification.recipientType === "all" && (
                <p className="notification-recipient">
                  Sent to: <strong>All Users</strong>
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Send New Notification</h2>
              <button type="button" className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Notification title"
                />
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your notification message..."
                  rows={6}
                />
              </div>
              <div className="form-group">
                <label>Recipient Type *</label>
                <select
                  value={formData.recipientType}
                  onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                >
                  <option value="all">All Users</option>
                  <option value="specific">Specific User</option>
                </select>
              </div>
              {formData.recipientType === "specific" && (
                <div className="form-group">
                  <label>Recipient Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                    placeholder="user@email.com"
                  />
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">
                  <Send size={16} style={{ marginRight: "8px" }} />
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}

export default SendNotifications;
