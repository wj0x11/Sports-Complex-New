import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  Settings,
  Search,
  Clock,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import "../styles/dashboard-layout.css";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/coach-dashboard" },
  { id: "schedule", label: "Training Schedule", icon: CalendarDays, path: "/coach-schedule" },
  { id: "players", label: "Assigned Players", icon: Users, path: "/coach-players" },
  { id: "notes", label: "Training Notes", icon: FileText, path: "/coach-notes" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
];

function CoachDashboardLayout({ children, title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useBooking();

  const displayName = authUser?.fullName || authUser?.name || "Coach";
  const userInitial = displayName.charAt(0).toUpperCase();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div>
          <div className="dash-sidebar-logo">
            Battle<span>Blast</span>
          </div>

          <nav className="dash-sidebar-menu" aria-label="Coach dashboard navigation">
            {NAV_ITEMS.map(({ id, label, icon: Icon, path }) => (
              <button
                key={id}
                type="button"
                className={`dash-sidebar-item ${isActive(path) ? "dash-sidebar-item-active" : ""}`}
                onClick={() => navigate(path)}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="dash-sidebar-card">
          <span>TRAINING ACTIVE</span>
          <h4>Session Ready</h4>
          <p>Your training schedule is up to date and players are ready.</p>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-topbar">
          <div className="dash-search">
            <Search size={16} />
            <input type="text" placeholder="Search coach panel" />
          </div>

          <div className="dash-topbar-actions">
            <button type="button" className="dash-profile">
              <div className="dash-avatar">{userInitial}</div>
              <div>
                <h4>{displayName}</h4>
                <span>Coach</span>
              </div>
            </button>
          </div>
        </div>

        {(title || subtitle) && (
          <div className="dashboard-page-header">
            {title && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}

        {children}
      </main>
    </div>
  );
}

export default CoachDashboardLayout;
