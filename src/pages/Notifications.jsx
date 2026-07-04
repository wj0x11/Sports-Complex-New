import { useEffect, useState } from "react";
import { Bell, CheckCircle2, CalendarDays, Wallet, Megaphone } from "lucide-react";
import UserDashboardLayout from "../components/UserDashboardLayout";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { useBooking } from "../context/BookingContext";
import { apiClient } from "../services/api/client";
import "../styles/notifications.css";

function getNotificationIcon(title = "") {
  const lower = title.toLowerCase();
  if (lower.includes("payment")) return Wallet;
  if (lower.includes("booking") || lower.includes("reservation")) return CalendarDays;
  if (lower.includes("event") || lower.includes("tournament")) return Megaphone;
  if (lower.includes("confirm") || lower.includes("approved")) return CheckCircle2;
  return Bell;
}

function Notifications() {
  const { authUser } = useBooking();
  const isAdmin = authUser?.role === "admin";
  const Layout = isAdmin ? AdminDashboardLayout : UserDashboardLayout;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = authUser || JSON.parse(localStorage.getItem("user") || "null");
  const userEmail = isAdmin ? "admin" : user?.email || "";

  const fetchNotifications = () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }
    apiClient
      .getNotifications(userEmail)
      .then((data) => {
        setNotifications(Array.isArray(data) ? data : []);
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
    apiClient
      .markNotificationsRead(userEmail)
      .then(fetchNotifications)
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
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => n.status === "New").length;

  return (
    <Layout
      title="Notifications"
      subtitle={
        unreadCount > 0
          ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
          : "Stay updated with bookings, payments, reminders, and announcements."
      }
    >
      <div className="notifications-toolbar">
        <button type="button" className="mark-read-btn btn-primary" onClick={handleMarkAllRead}>
          Mark All As Read
        </button>
      </div>

      {loading ? (
        <div className="ui-loading">Loading notifications...</div>
      ) : notifications.length > 0 ? (
        <div className="notifications-list">
          {notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.title);
            return (
              <div
                className={`notification-card ui-card ${
                  notification.status === "New" ? "notification-unread" : ""
                }`}
                key={notification._id || notification.id}
              >
                <div className="notification-icon-wrap">
                  <Icon size={20} />
                </div>
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
            );
          })}
        </div>
      ) : (
        <div className="ui-empty-state">
          <Bell size={32} style={{ margin: "0 auto 12px", color: "var(--primary)" }} />
          <h2>No notifications</h2>
          <p>You are all caught up!</p>
        </div>
      )}
    </Layout>
  );
}

export default Notifications;
