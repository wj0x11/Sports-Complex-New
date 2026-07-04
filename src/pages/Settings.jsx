import { useState } from "react";
import UserDashboardLayout from "../components/UserDashboardLayout";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { useBooking } from "../context/BookingContext";
import "../styles/settings.css";

const SETTINGS_KEY = "userSettings";

const defaultSettings = {
  emailNotifications: true,
  smsAlerts: true,
  bookingReminders: true,
  paymentAlerts: true,
  eventAnnouncements: true,
};

function Settings() {
  const { authUser } = useBooking();
  const isAdmin = authUser?.role === "admin";
  const Layout = isAdmin ? AdminDashboardLayout : UserDashboardLayout;
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const toggleSetting = (key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const settingItems = [
    {
      key: "emailNotifications",
      title: "Email Notifications",
      description: "Receive booking and payment updates via email.",
    },
    {
      key: "smsAlerts",
      title: "SMS Alerts",
      description: "Receive sports session reminders through SMS.",
    },
    {
      key: "bookingReminders",
      title: "Booking Reminders",
      description: "Get reminders 24 hours and 1 hour before your reservation.",
    },
    {
      key: "paymentAlerts",
      title: "Payment Confirmations",
      description: "Notifications when payments are processed successfully.",
    },
    {
      key: "eventAnnouncements",
      title: "Event Announcements",
      description: "Updates about tournaments and sports events at the complex.",
    },
  ];

  return (
    <Layout
      title="Settings"
      subtitle="Manage notifications, preferences, and account settings."
    >
      <div className="settings-grid">
        <div className="settings-card ui-card">
          <h2>Notifications</h2>

          {settingItems.map(({ key, title, description }) => (
            <div className="setting-item" key={key}>
              <div className="setting-info">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <button
                type="button"
                className={`toggle-btn ${settings[key] ? "toggle-active" : ""}`}
                onClick={() => toggleSetting(key)}
                aria-pressed={settings[key]}
                aria-label={`Toggle ${title}`}
              >
                <div className="toggle-circle"></div>
              </button>
            </div>
          ))}
        </div>

        <div className="settings-card ui-card">
          <h2>Preferences</h2>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Language</h3>
              <p>English (Sri Lanka)</p>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Time Zone</h3>
              <p>Asia/Colombo (UTC+5:30)</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Settings;
