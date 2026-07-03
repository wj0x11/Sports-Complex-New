import { useEffect, useState } from "react";
import { apiClient } from "../services/api/client";
import "../styles/notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user")) || null;
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const userEmail = isAdmin ? "admin" : (currentUser?.email || "");

  const fetchNotifications = () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    apiClient.getNotifications(userEmail)
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, [userEmail]);

  const handleMarkAllRead = () => {
    if (!userEmail) return;
    apiClient.markNotificationsRead(userEmail)
      .then(() => {
        fetchNotifications();
      })
      .catch((err) => console.error("Error marking read:", err));
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} Minutes Ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'Hour' : 'Hours'} Ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notifications-page">
      <div className="container">
        <div className="notifications-header">
          <div>
            <h1 className="notifications-title">Notifications</h1>

            <p className="notifications-subtitle">
              Stay updated with bookings, payments, reminders, and sports
              complex announcements.
            </p>
          </div>

          <button className="mark-read-btn" onClick={handleMarkAllRead}>
            Mark All As Read
          </button>
        </div>

        {loading ? (
          <div style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>
            Loading notifications...
          </div>
        ) : notifications.length > 0 ? (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div className="notification-card" key={notification._id}>
                <div className="notification-info">
                  <h2>{notification.title}</h2>

                  <p>{notification.message}</p>

                  <span className="notification-time">
                    {formatTime(notification.createdAt)}
                  </span>
                </div>

                <div
                  className={`notification-status ${
                    notification.status === "New" ? "status-new" : "status-read"
                  }`}
                >
                  {notification.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            color: "#64748b",
            textAlign: "center",
            padding: "60px 40px",
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: "12px",
            border: "1px dashed rgba(255, 255, 255, 0.08)"
          }}>
            <h2>No notifications</h2>
            <p style={{ marginTop: "10px", fontSize: "14px" }}>You are all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
