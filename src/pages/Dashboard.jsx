import {
  LayoutDashboard,
  CalendarDays,
  Trophy,
  Bell,
  Settings,
  Search,
  Plus,
  Activity,
  Wallet,
  Users,
} from "lucide-react";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [bookings] = useState(() => {
    return JSON.parse(localStorage.getItem("sportsBookings")) || [];
  });

  const [user] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const totalBookings = bookings.length;

  const totalPayments = bookings.reduce(
    (total, booking) => total + (booking.totalAmount || 0),
    0,
  );

  const upcomingSessions = bookings.filter(
    (booking) => booking.status === "Confirmed",
  ).length;

  const coachingSessions = bookings.filter((booking) => booking.coach).length;

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div>
          <div className="sidebar-logo">Battle Blast</div>

          <div className="sidebar-menu">
            <div className="sidebar-item active-sidebar-item">
              <LayoutDashboard size={18} />

              <span>Dashboard</span>
            </div>

            <div className="sidebar-item">
              <CalendarDays size={18} />

              <span>Bookings</span>
            </div>

            <div className="sidebar-item">
              <Trophy size={18} />

              <span>Sports</span>
            </div>

            <div className="sidebar-item">
              <Wallet size={18} />

              <span>Payments</span>
            </div>

            <div className="sidebar-item">
              <Users size={18} />

              <span>Members</span>
            </div>

            <div className="sidebar-item">
              <Bell size={18} />

              <span>Notifications</span>
            </div>

            <div className="sidebar-item">
              <Settings size={18} />

              <span>Settings</span>
            </div>
          </div>
        </div>

        <div className="sidebar-bottom-card">
          <span>Premium Access</span>

          <h4>Sports Complex Access</h4>

          <p>
            Manage reservations, coaching sessions, schedules, and sports
            activities from one centralized dashboard.
          </p>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="search-box">
            <Search size={18} />

            <input type="text" placeholder="Search bookings or facilities" />
          </div>

          <div className="topbar-right">
            <button
              className="new-booking-btn"
              onClick={() => navigate("/sports/badminton")}
            >
              <Plus size={17} />

              <span>New Booking</span>
            </button>

            <div className="notification-btn">
              <Bell size={18} />
            </div>

            <div className="profile-box">
              <div className="profile-avatar">
                {user?.firstName?.charAt(0) || "M"}
              </div>

              <div>
                <h4>{user?.name || "Member"}</h4>

                <span>{user?.membership || "Standard Member"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-header">
          <div>
            <span className="dashboard-badge">Battle Blast Dashboard</span>

            <h1 className="dashboard-title">
              Welcome Back!
            </h1>

            <p className="dashboard-subtitle">
              Manage reservations, coaching sessions, sports activities,
              schedules, and payments from one centralized dashboard.
            </p>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <CalendarDays size={18} />
            </div>

            <span>Total Bookings</span>

            <h2>{totalBookings}</h2>

            <p>Reservation sessions completed</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Activity size={18} />
            </div>

            <span>Upcoming Sessions</span>

            <h2>{upcomingSessions}</h2>

            <p>Confirmed active reservations</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Wallet size={18} />
            </div>

            <span>Total Payments</span>

            <h2>LKR {totalPayments.toLocaleString()}</h2>

            <p>Reservation payments processed</p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Users size={18} />
            </div>

            <span>Coaching Sessions</span>

            <h2>{coachingSessions}</h2>

            <p>Professional coaching reservations</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-large-card">
            <div className="card-top">
              <h2>Upcoming Reservations</h2>

              <button>View All</button>
            </div>

            <table className="booking-table">
              <thead>
                <tr>
                  <th>Sport</th>

                  <th>Facility</th>

                  <th>Date</th>

                  <th>Time</th>

                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <tr key={index}>
                      <td>{booking?.sport?.name || "Sports Session"}</td>

                      <td>
                        {booking?.court?.name ||
                          booking?.coach?.name ||
                          "Coaching Session"}
                      </td>

                      <td>{booking?.bookingDetails?.bookingDate}</td>

                      <td>{booking?.bookingDetails?.bookingTime}</td>

                      <td>
                        <span className="table-status">
                          {booking.status || "Confirmed"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No reservations available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="dashboard-side-column">
            <div className="dashboard-small-card activity-card">
              <div className="card-top">
                <h2>Recent Activity</h2>

                <button>View All</button>
              </div>

              <div className="activity-list">
                {bookings.length > 0 ? (
                  bookings.slice(0, 3).map((booking, index) => (
                    <div className="activity-item" key={index}>
                      <div className="activity-indicator success-indicator">
                        <CalendarDays size={14} />
                      </div>

                      <div className="activity-content">
                        <div className="activity-header">
                          <h4>
                            {booking?.sport?.name || "Sports"} reservation
                            confirmed
                          </h4>

                          <span>
                            {booking.createdAt
                              ? new Date(booking.createdAt).toLocaleDateString()
                              : "Today"}
                          </span>
                        </div>

                        <p>
                          {booking?.bookingDetails?.bookingTime} booking
                          scheduled successfully.
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="activity-item">
                    <div className="activity-content">
                      <p>No recent activity available.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="dashboard-small-card membership-card">
              <span className="membership-badge">
                {user?.membership || "Standard Member"}
              </span>

              <h2>Membership Active</h2>

              <p>
                Your sports reservations, coaching sessions, schedules, and
                payments are fully connected with the live dashboard system.
              </p>

              <div className="membership-footer">
                Joined{" "}
                {user?.joinedDate
                  ? new Date(user.joinedDate).toLocaleDateString()
                  : "Recently"}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
