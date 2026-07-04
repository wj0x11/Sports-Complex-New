import { CalendarDays, Activity, Wallet, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDashboardLayout from "../components/UserDashboardLayout";
import { useBooking } from "../context/BookingContext";
import { apiClient } from "../services/api/client";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { authUser } = useBooking();
  const [bookings, setBookings] = useState([]);

  const user = authUser || JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user?.email) return;
    const loadBookings = () => {
      apiClient
        .getUserBookings(user.email)
        .then(setBookings)
        .catch((err) => console.error("Error fetching user bookings:", err));
    };

    loadBookings();
    window.addEventListener("bookings-updated", loadBookings);
    return () => window.removeEventListener("bookings-updated", loadBookings);
  }, [user?.email]);

  const totalBookings = bookings.length;
  const totalPayments = bookings.reduce(
    (total, booking) => total + (booking.totalAmount || 0),
    0,
  );
  const upcomingSessions = bookings.filter(
    (booking) =>
      booking.status === "Confirmed" || booking.status === "Approved",
  ).length;
  const coachingSessions = bookings.filter((booking) => booking.coach).length;

  const upcomingBookings = bookings.filter((b) => {
    const dateStr = b?.bookingDetails?.bookingDate;
    if (!dateStr) return false;
    const bookingDate = new Date(dateStr);
    bookingDate.setHours(23, 59, 59, 999);
    return bookingDate >= new Date() && b.status !== "Cancelled";
  });

  return (
    <UserDashboardLayout>
      <div className="dashboard-header">
        <div>
          <span className="dashboard-badge">Battle Blast Dashboard</span>
          <h1 className="dashboard-title">Welcome Back!</h1>
          <p className="dashboard-subtitle">
            Manage reservations, coaching sessions, sports activities, schedules, and
            payments from one centralized dashboard.
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
            <button type="button" onClick={() => navigate("/booking-history")}>
              View All
            </button>
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
              {upcomingBookings.length > 0 ? (
                upcomingBookings.slice(0, 5).map((booking, index) => (
                  <tr key={booking._id || booking.id || index}>
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
                  <td colSpan="5">No upcoming reservations</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="dashboard-side-column">
          <div className="dashboard-small-card activity-card">
            <div className="card-top">
              <h2>Recent Activity</h2>
              <button type="button" onClick={() => navigate("/notifications")}>
                View All
              </button>
            </div>

            <div className="activity-list">
              {bookings.length > 0 ? (
                bookings.slice(0, 3).map((booking, index) => (
                  <div className="activity-item" key={booking._id || booking.id || index}>
                    <div className="activity-indicator success-indicator">
                      <CalendarDays size={14} />
                    </div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <h4>
                          {booking?.sport?.name || "Sports"} reservation confirmed
                        </h4>
                        <span>
                          {booking.createdAt
                            ? new Date(booking.createdAt).toLocaleDateString()
                            : "Today"}
                        </span>
                      </div>
                      <p>
                        {booking?.bookingDetails?.bookingTime} booking scheduled
                        successfully.
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
              Your sports reservations, coaching sessions, schedules, and payments are
              fully connected with the live dashboard system.
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
    </UserDashboardLayout>
  );
}

export default Dashboard;
