import {
  CalendarDays,
  Wallet,
  Trophy,
  Users,
  Download,
  TrendingUp,
} from "lucide-react";

import { useMemo } from "react";

import "../styles/adminReports.css";

function AdminReports() {
  const bookings = JSON.parse(localStorage.getItem("sportsBookings")) || [];

  const totalRevenue = bookings.reduce(
    (total, booking) => total + booking.amount,
    0,
  );

  const totalBookings = bookings.length;

  const approvedBookings = bookings.filter(
    (booking) => booking.status === "Approved",
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed",
  ).length;

  const totalUsers = new Set(bookings.map((b) => b.user)).size;

  const badmintonBookings = bookings.filter(
    (booking) => booking.sport === "Badminton",
  ).length;

  const tableTennisBookings = bookings.filter(
    (booking) => booking.sport === "Table Tennis",
  ).length;

  const sportUsage = useMemo(() => {
    const total = badmintonBookings + tableTennisBookings;

    return {
      badminton:
        total === 0 ? 0 : Math.round((badmintonBookings / total) * 100),

      tableTennis:
        total === 0 ? 0 : Math.round((tableTennisBookings / total) * 100),
    };
  }, [badmintonBookings, tableTennisBookings]);

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <span className="reports-badge">Battle Blast Reports Center</span>

          <h1>System Reports</h1>

          <p>
            View reservation statistics, revenue summaries, and facility usage
            analytics.
          </p>
        </div>

        <button className="download-report-btn">
          <Download size={15} />
          Export Report
        </button>
      </div>

      <div className="reports-stats-grid">
        <div className="reports-stat-card">
          <div className="reports-icon">
            <Wallet size={18} />
          </div>

          <span>Total Revenue</span>

          <h2>LKR {totalRevenue.toLocaleString()}</h2>

          <p>Monthly reservation earnings</p>
        </div>

        <div className="reports-stat-card">
          <div className="reports-icon">
            <CalendarDays size={18} />
          </div>

          <span>Total Reservations</span>

          <h2>{totalBookings}</h2>

          <p>System reservation count</p>
        </div>

        <div className="reports-stat-card">
          <div className="reports-icon">
            <Users size={18} />
          </div>

          <span>Active Members</span>

          <h2>{totalUsers}</h2>

          <p>Users with reservations</p>
        </div>

        <div className="reports-stat-card">
          <div className="reports-icon">
            <TrendingUp size={18} />
          </div>

          <span>Completed Sessions</span>

          <h2>{completedBookings}</h2>

          <p>Successfully completed</p>
        </div>
      </div>

      <div className="reports-grid">
        <div className="reports-card">
          <div className="reports-card-header">
            <div>
              <span className="reports-label">Reservation Analytics</span>

              <h2>Booking Summary</h2>
            </div>
          </div>

          <div className="summary-list">
            <div className="summary-row">
              <span>Approved Reservations</span>

              <strong>{approvedBookings}</strong>
            </div>

            <div className="summary-row">
              <span>Completed Reservations</span>

              <strong>{completedBookings}</strong>
            </div>

            <div className="summary-row">
              <span>Badminton Bookings</span>

              <strong>{badmintonBookings}</strong>
            </div>

            <div className="summary-row">
              <span>Table Tennis Bookings</span>

              <strong>{tableTennisBookings}</strong>
            </div>
          </div>
        </div>

        <div className="reports-card">
          <div className="reports-card-header">
            <div>
              <span className="reports-label">Facility Analytics</span>

              <h2>Facility Usage</h2>
            </div>
          </div>

          <div className="analytics-wrapper">
            <div>
              <div className="analytics-row">
                <span>Badminton Usage</span>

                <strong>{sportUsage.badminton}%</strong>
              </div>

              <div className="analytics-bar">
                <div
                  className="analytics-fill badminton-fill"
                  style={{
                    width: `${sportUsage.badminton}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="analytics-row">
                <span>Table Tennis Usage</span>

                <strong>{sportUsage.tableTennis}%</strong>
              </div>

              <div className="analytics-bar">
                <div
                  className="analytics-fill table-fill"
                  style={{
                    width: `${sportUsage.tableTennis}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="reports-card full-card">
          <div className="reports-card-header">
            <div>
              <span className="reports-label">Revenue Overview</span>

              <h2>Revenue Breakdown</h2>
            </div>
          </div>

          <table className="reports-table">
            <thead>
              <tr>
                <th>User</th>

                <th>Sport</th>

                <th>Facility</th>

                <th>Status</th>

                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.user}</td>

                  <td>{booking.sport}</td>

                  <td>{booking.facility}</td>

                  <td>{booking.status}</td>

                  <td>LKR {booking.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
