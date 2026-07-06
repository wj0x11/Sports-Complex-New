import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Activity,
  Wallet,
  Users,
  CheckCircle2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { apiClient } from "../services/api/client";
import "../styles/adminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    todayBookings: 0,
    upcomingTournaments: 0,
    equipmentCount: 0
  });
  const [utilization, setUtilization] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const overview = await apiClient.getAdminOverview();
        const dashboardStats = await apiClient.getDashboardStats();
        setBookings(overview.bookings);
        setStats(dashboardStats);
        setUtilization(overview.utilization);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
    window.addEventListener("bookings-updated", loadData);
    return () => window.removeEventListener("bookings-updated", loadData);
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const value = searchTerm.toLowerCase();
      const userName =
        typeof booking.user === "string"
          ? booking.user
          : booking.user?.firstName || booking.user?.fullName || "Unknown User";

      return (
        userName.toLowerCase().includes(value) ||
        String(booking.sport?.name || booking.sport || "").toLowerCase().includes(value) ||
        String(booking.facility || booking.court?.name || booking.coach?.name || "").toLowerCase().includes(value)
      );
    });
  }, [bookings, searchTerm]);

  const updateBookingStatus = (bookingId, status) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId || booking._id === bookingId
          ? { ...booking, status }
          : booking,
      ),
    );
    apiClient.updateBookingStatus(bookingId, status);
  };

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AdminDashboardLayout>
      <div className="dashboard-welcome">
        <div>
          <h1>Welcome Back</h1>
          <p>Monitor reservations, revenue, and operational analytics.</p>
        </div>
        <div className="welcome-date">{today}</div>
      </div>

      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-icon">
            <CalendarDays size={16} />
          </div>
          <span>Total Reservations</span>
          <h2>{stats.totalBookings}</h2>
          <p>Today: {stats.todayBookings}</p>
        </div>

        <div className="stats-card">
          <div className="stats-icon">
            <Wallet size={16} />
          </div>
          <span>Total Revenue</span>
          <h2>LKR {stats.totalRevenue.toLocaleString()}</h2>
          <p>All-time earnings</p>
        </div>

        <div className="stats-card">
          <div className="stats-icon">
            <Users size={16} />
          </div>
          <span>Registered Users</span>
          <h2>{stats.totalUsers}</h2>
          <p>Active members</p>
        </div>

        <div className="stats-card">
          <div className="stats-icon">
            <Activity size={16} />
          </div>
          <span>Equipment</span>
          <h2>{stats.equipmentCount}</h2>
          <p>Available for rent</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <span className="card-label">RESERVATION MANAGEMENT</span>
              <h2>Recent Reservations</h2>
            </div>
            <button type="button" onClick={() => navigate("/manage-bookings")}>
              View All
            </button>
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
              {filteredBookings.slice(0, 8).map((booking) => (
                <tr key={booking.id || booking._id}>
                  <td>
                    {typeof booking.user === "string"
                      ? booking.user
                      : booking.user?.fullName || booking.user?.firstName || "Unknown User"}
                  </td>
                  <td>{booking.sport?.name || booking.sport || "Sports"}</td>
                  <td>
                    {booking.facility || booking.court?.name || booking.coach?.name}
                  </td>
                  <td>
                    {booking.date || booking.bookingDetails?.bookingDate || "-"}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        booking.status === "Approved" || booking.status === "Confirmed"
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
                        type="button"
                        className="approve-btn"
                        onClick={() =>
                          updateBookingStatus(booking.id || booking._id, "Approved")
                        }
                        aria-label="Approve"
                      >
                        <CheckCircle2 size={13} />
                      </button>
                      <button
                        type="button"
                        className="complete-btn"
                        onClick={() =>
                          updateBookingStatus(booking.id || booking._id, "Completed")
                        }
                        aria-label="Complete"
                      >
                        <ShieldCheck size={13} />
                      </button>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() =>
                          updateBookingStatus(booking.id || booking._id, "Cancelled")
                        }
                        aria-label="Cancel"
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
            {utilization.map((item, index) => (
              <div key={item.slug || item.sport}>
                <div className="analytics-row">
                  <span>{item.sport} Usage</span>
                  <strong>{item.usageCount || 0}</strong>
                </div>
                <div className="analytics-bar">
                  <div
                    className={`analytics-fill ${
                      index % 4 === 0
                        ? "badminton-fill"
                        : index % 4 === 1
                          ? "table-fill"
                          : index % 4 === 2
                            ? "revenue-fill"
                            : "table-fill"
                    }`}
                    style={{
                      width: `${Math.min(100, (item.usageCount || 0) * 20)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

export default AdminDashboard;
