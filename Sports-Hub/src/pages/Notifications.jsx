import { useEffect, useState } from "react";
import { useBooking } from "../context/BookingContext";
import { apiClient } from "../../../src/services/api/client";
import "../styles/notifications.css";

function Notifications() {
  const { authUser } = useBooking();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!authUser?.email) return;
    apiClient.getNotifications(authUser.email).then(setNotifications);
  }, [authUser]);

  const markAllAsRead = async () => {
    await apiClient.markAllNotificationsRead(authUser?.email);
    const updated = await apiClient.getNotifications(authUser?.email);
    setNotifications(updated);
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

          <button className="mark-read-btn" onClick={markAllAsRead}>
            Mark All As Read
          </button>
        </div>

        <div className="notifications-list">
          {notifications.length === 0 && (
            <div className="notification-card">
              <div className="notification-info">
                <h2>No notifications yet</h2>
                <p>Live updates for bookings and payments will appear here.</p>
              </div>
            </div>
          )}
          {notifications.map((notification) => (
            <div className="notification-card" key={notification.id}>
              <div className="notification-info">
                <h2>{notification.title}</h2>

                <p>{notification.message}</p>

                <span className="notification-time">
                  {new Date(notification.createdAt).toLocaleString()}
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
      </div>
    </div>
  );
}

export default Notifications;
