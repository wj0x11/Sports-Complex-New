import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  Trophy,
  Bell,
  Settings,
  Search,
  FileText,
  MapPin,
  UserCheck,
  Package,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import "../styles/dashboard-layout.css";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
  { id: "bookings", label: "Reservations", icon: CalendarDays, path: "/manage-bookings" },
  { id: "users", label: "Members", icon: Users, path: "/manage-users" },
  { id: "sports", label: "Sports", icon: Trophy, path: "/manage-sports" },
  { id: "courts", label: "Courts", icon: MapPin, path: "/manage-courts" },
  { id: "coaches", label: "Coaches", icon: UserCheck, path: "/manage-coaches" },
  { id: "equipment", label: "Equipment", icon: Package, path: "/manage-equipment" },
  { id: "payments", label: "Payments", icon: Wallet, path: "/manage-payments" },
  { id: "reports", label: "Reports", icon: FileText, path: "/admin-reports" },
  { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
];

function AdminDashboardLayout({ children, title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useBooking();

  const displayName = authUser?.fullName || authUser?.name || "Administrator";
  const userInitial = displayName.charAt(0).toUpperCase();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dash-layout admin-dash-layout">
      <aside className="dash-sidebar">
        <div>
          <div className="dash-sidebar-logo">
            Battle<span>Blast</span>
          </div>

          <nav className="dash-sidebar-menu" aria-label="Admin dashboard navigation">
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
          <span>SYSTEM ACTIVE</span>
          <h4>Operations Stable</h4>
          <p>All reservations and payment systems are functioning normally.</p>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-topbar">
          <div className="dash-search">
            <Search size={16} />
            <input type="text" placeholder="Search admin panel" />
          </div>

          <div className="dash-topbar-actions">
            <button type="button" className="dash-profile">
              <div className="dash-avatar">{userInitial}</div>
              <div>
                <h4>{displayName}</h4>
                <span>Administrator</span>
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

export default AdminDashboardLayout;
