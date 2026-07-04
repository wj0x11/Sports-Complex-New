import {
  LayoutDashboard,
  CalendarDays,
  Trophy,
  Bell,
  Settings,
  Search,
  Plus,
  Wallet,
  User,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { getFeaturedSports } from "../services/sports.service";
import "../styles/dashboard-layout.css";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "bookings", label: "Bookings", icon: CalendarDays, path: "/booking-history" },
  { id: "payments", label: "Payments", icon: Wallet, path: "/payments" },
  { id: "sports", label: "Sports", icon: Trophy, path: "/sports" },
  { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
];

function UserDashboardLayout({ children, title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, logoutUser } = useBooking();
  const featuredSports = getFeaturedSports();

  const user = authUser || JSON.parse(localStorage.getItem("user") || "null");
  const displayName = user?.fullName || user?.name || "Member";
  const userInitial = displayName.charAt(0).toUpperCase();

  const isActive = (path) => {
    if (path === "/sports") {
      return location.pathname === "/sports" || location.pathname.startsWith("/sports/");
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="dash-layout user-dash-layout">
      <aside className="dash-sidebar">
        <div>
          <div className="dash-sidebar-logo">Battle Blast</div>

          <nav className="dash-sidebar-menu" aria-label="User dashboard navigation">
            {NAV_ITEMS.map(({ id, label, icon: Icon, path }) => (
              <button
                key={id}
                type="button"
                className={`dash-sidebar-item ${isActive(path) ? "dash-sidebar-item-active" : ""}`}
                onClick={() => navigate(path)}
              >
                <Icon size={18} />
                <span>
                  {label}
                  {id === "sports" ? ` (${featuredSports.length})` : ""}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="dash-sidebar-card">
          <span>Premium Access</span>
          <h4>Sports Complex Access</h4>
          <p>
            Manage reservations, coaching sessions, schedules, and payments from one
            centralized dashboard.
          </p>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-topbar">
          <div className="dash-search">
            <Search size={18} />
            <input type="text" placeholder="Search bookings or facilities" />
          </div>

          <div className="dash-topbar-actions">
            <button
              type="button"
              className="dash-action-btn"
              onClick={() => navigate("/sports")}
            >
              <Plus size={17} />
              <span>New Booking</span>
            </button>

            <button
              type="button"
              className="dash-icon-btn"
              onClick={() => navigate("/notifications")}
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>

            <button
              type="button"
              className="dash-profile"
              onClick={() => navigate("/profile")}
            >
              <div className="dash-avatar">{userInitial}</div>
              <div>
                <h4>{displayName}</h4>
                <span>{user?.membership || "Standard Member"}</span>
              </div>
            </button>

            <button
              type="button"
              className="dash-icon-btn dash-logout-btn"
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={18} />
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

export default UserDashboardLayout;
