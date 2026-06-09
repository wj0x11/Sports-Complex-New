import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  Trophy,
  Bell,
  Settings,
  Search,
  Plus,
  CheckCircle2,
  ShieldCheck,
  XCircle,
  FileText,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminDashboard.css";
import { apiClient } from "../services/api/client";


function AdminDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [bookings, setBookings] = useState([]);
  const [sportsCount, setSportsCount] = useState(0);
  const [utilization, setUtilization] = useState([]);

  useEffect(() => {
    apiClient.getAdminOverview().then((overview) => {
      setBookings(overview.bookings);
      setSportsCount(overview.sports.length);
      setUtilization(overview.utilization);
    });
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const value = searchTerm.toLowerCase();

      const userName =
        typeof booking.user === "string"
          ? booking.user
          : booking.user?.firstName || "Unknown User";

      return (
        userName.toLowerCase().includes(value) ||
        String(booking.sport || "")
          .toLowerCase()
          .includes(value) ||
        String(booking.facility || "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [bookings, searchTerm]);

  const totalRevenue = bookings.reduce(
    (total, booking) => total + (booking.amount || booking.totalAmount || 0),
    0,
  );

  const activeUsers = new Set(
    bookings.map((b) =>
      typeof b.user === "string" ? b.user : b.user?.firstName || "Unknown User",
    ),
  ).size;
  const updateBookingStatus = (bookingId, status) => {
    const updated = bookings.map((booking) =>
      booking.id === bookingId
        ? {
            ...booking,
            status,
          }
        : booking,
    );

    setBookings(updated);
    apiClient.updateBookingStatus(bookingId, status);
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div>
          <div className="sidebar-logo">
            Battle<span>Blast</span>
          </div>

          <div className="sidebar-menu">
            <div className="sidebar-item active-item">
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </div>

            <div
              className="sidebar-item"
              onClick={() => navigate("/manage-bookings")}
            >
              <CalendarDays size={16} />
              <span>Reservations</span>
            </div>

            <div
              className="sidebar-item"
              onClick={() => navigate("/manage-users")}
            >
              <Users size={16} />
              <span>Members</span>
            </div>

            <div
              className="sidebar-item"
              onClick={() => navigate("/manage-sports")}
            >
              <Trophy size={16} />
              <span>Facilities</span>
            </div>

            <div
              className="sidebar-item"
              onClick={() => navigate("/manage-payments")}
            >
              <Wallet size={16} />
              <span>Payments</span>
            </div>

            <div
              className="sidebar-item"
              onClick={() => navigate("/admin-reports")}
            >
              <FileText size={16} />
              <span>Reports</span>
            </div>

            <div className="sidebar-item">
              <Bell size={16} />
              <span>Notifications</span>
            </div>

            <div className="sidebar-item">
              <Settings size={16} />
              <span>Settings</span>
            </div>
          </div>
        </div>

        <div className="system-card">
          <span>SYSTEM ACTIVE</span>

          <h3>Operations Stable</h3>

          <p>All reservations and payment systems are functioning normally.</p>
        </div>
      </aside>

      <main className="admin-content">
        <div className="admin-topbar">
          <div className="search-box">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search reservations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="topbar-right">
            <button className="new-booking-btn">
              <Plus size={14} />
              New Booking
            </button>

            <div className="admin-profile">
              <div className="profile-avatar">AG</div>

              <div>
                <h4>Admin Gayantha</h4>

                <span>Administrator</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-welcome">
          <div>
            <h1>Welcome Back</h1>

            <p>Monitor reservations, revenue, and operational analytics.</p>
          </div>

          <div className="welcome-date">25 May 2026</div>
        </div>

        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-icon">
              <CalendarDays size={16} />
            </div>

            <span>Total Reservations</span>

            <h2>{bookings.length}</h2>

            <p>Active bookings</p>

            <div className="mini-chart">
              <div className="mini-chart-fill"></div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-icon">
              <Wallet size={16} />
            </div>

            <span>Total Revenue</span>

            <h2>LKR {totalRevenue.toLocaleString()}</h2>

            <p>Monthly earnings</p>

            <div className="mini-chart">
              <div className="mini-chart-fill"></div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-icon">
              <Users size={16} />
            </div>

            <span>Members</span>

            <h2>{activeUsers}</h2>

            <p>Registered users</p>

            <div className="mini-chart">
              <div className="mini-chart-fill"></div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-icon">
              <Trophy size={16} />
            </div>

            <span>Total Sports</span>

            <h2>{sportsCount}</h2>

            <p>Active sports facilities</p>

            <div className="mini-chart">
              <div className="mini-chart-fill"></div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <span className="card-label">RESERVATION MANAGEMENT</span>

                <h2>Recent Reservations</h2>
              </div>

              <button>View All</button>
            </div>

            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>User</th>

                  <th>Sport</th>

                  <th>Facility</th>

                  <th>Date</th>

                  <th>Status</th>

                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      {typeof booking.user === "string"
                        ? booking.user
                        : booking.user?.firstName || "Unknown User"}
                    </td>

                    <td>{booking.sport?.name || booking.sport || "Sports"}</td>

                    <td>{booking.facility || booking.court?.name || booking.coach?.name}</td>

                    <td>{booking.date || booking.bookingDetails?.bookingDate || "-"}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          booking.status === "Approved"
                            ? "approved-status"
                            : booking.status === "Completed"
                              ? "completed-status"
                              : "pending-status"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="approve-btn"
                          onClick={() =>
                            updateBookingStatus(booking.id, "Approved")
                          }
                        >
                          <CheckCircle2 size={13} />
                        </button>

                        <button
                          className="complete-btn"
                          onClick={() =>
                            updateBookingStatus(booking.id, "Completed")
                          }
                        >
                          <ShieldCheck size={13} />
                        </button>

                        <button
                          className="cancel-btn"
                          onClick={() =>
                            updateBookingStatus(booking.id, "Cancelled")
                          }
                        >
                          <XCircle size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="side-card">
            <span className="card-label">LIVE ANALYTICS</span>

            <h2>Performance</h2>

            <div className="analytics-list">
              <div>
                <div className="analytics-row">
                  <span>{utilization[0]?.sport || "Badminton"} Usage</span>
                  <strong>{utilization[0]?.usageCount || 0}</strong>
                </div>

                <div className="analytics-bar">
                  <div className="analytics-fill badminton-fill"></div>
                </div>
              </div>

              <div>
                <div className="analytics-row">
                  <span>{utilization[1]?.sport || "Table Tennis"}</span>
                  <strong>{utilization[1]?.usageCount || 0}</strong>
                </div>

                <div className="analytics-bar">
                  <div className="analytics-fill table-fill"></div>
                </div>
              </div>

              <div>
                <div className="analytics-row">
                  <span>{utilization[2]?.sport || "Basketball"} Usage</span>
                  <strong>{utilization[2]?.usageCount || 0}</strong>
                </div>

                <div className="analytics-bar">
                  <div className="analytics-fill revenue-fill"></div>
                </div>
              </div>

              <div>
                <div className="analytics-row">
                  <span>{utilization[3]?.sport || "Volleyball"} Usage</span>
                  <strong>{utilization[3]?.usageCount || 0}</strong>
                </div>

                <div className="analytics-bar">
                  <div className="analytics-fill table-fill"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
