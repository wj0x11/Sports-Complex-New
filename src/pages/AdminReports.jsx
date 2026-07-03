import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Wallet,
  Trophy,
  Users,
  Download,
  TrendingUp,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { apiClient } from "../services/api/client";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import "../styles/adminReports.css";

function AdminReports() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRange, setFilterRange] = useState("all"); // 'all', 'daily', 'weekly', 'monthly'

  useEffect(() => {
    apiClient.getAdminOverview()
      .then((overview) => {
        setBookings(overview.bookings);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading reports data:", err);
        setLoading(false);
      });
  }, []);

  const filteredBookings = useMemo(() => {
    if (filterRange === "all") return bookings;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter((booking) => {
      const dateStr = booking.bookingDetails?.bookingDate || booking.date;
      if (!dateStr) return false;

      const bookingDate = new Date(dateStr);
      bookingDate.setHours(0, 0, 0, 0);

      const diffTime = today - bookingDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (filterRange === "daily") {
        return bookingDate.toDateString() === today.toDateString();
      } else if (filterRange === "weekly") {
        return diffDays >= 0 && diffDays <= 7;
      } else if (filterRange === "monthly") {
        return diffDays >= 0 && diffDays <= 30;
      }
      return true;
    });
  }, [bookings, filterRange]);

  const totalRevenue = filteredBookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((total, booking) => total + (booking.totalAmount || booking.amount || 0), 0);

  const totalBookings = filteredBookings.length;

  const approvedBookings = filteredBookings.filter(
    (booking) => booking.status === "Approved" || booking.status === "Confirmed",
  ).length;

  const completedBookings = filteredBookings.filter(
    (booking) => booking.status === "Completed",
  ).length;

  const totalUsers = new Set(
    filteredBookings.map((b) => b.userEmail || (typeof b.user === "string" ? b.user : b.user?.email))
  ).size;

  const sportUsage = useMemo(() => {
    const counts = {};
    let total = 0;
    filteredBookings.forEach((b) => {
      const sportName = b.sport?.name || b.sport || "Unknown";
      counts[sportName] = (counts[sportName] || 0) + 1;
      total++;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: total === 0 ? 0 : Math.round((count / total) * 100),
    }));
  }, [filteredBookings]);

  const exportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("Battle Blast Sports Complex", 14, 20);

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Report Generation Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 26);
    doc.text(`Time Filter: ${filterRange.toUpperCase()}`, 14, 31);

    // Summary Box
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.rect(14, 38, 182, 28, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text("SUMMARY METRICS", 18, 44);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(`Total Bookings: ${totalBookings}`, 18, 52);
    doc.text(`Total Revenue: LKR ${totalRevenue.toLocaleString()}`, 18, 60);
    doc.text(`Active Users: ${totalUsers}`, 100, 52);
    doc.text(`Completed Sessions: ${completedBookings}`, 100, 60);

    // Table headers and data
    const tableHeaders = [["User", "Sport", "Facility", "Date", "Status", "Amount"]];
    const tableData = filteredBookings.map((b) => [
      typeof b.user === "string" ? b.user : (b.user?.fullName || b.userEmail),
      b.sport?.name || b.sport || "Sport",
      b.court?.name || b.coach?.name || b.facility || "Facility",
      b.bookingDetails?.bookingDate || b.date || "-",
      b.status || "-",
      `LKR ${(b.totalAmount || b.amount || 0).toLocaleString()}`
    ]);

    doc.autoTable({
      startY: 72,
      head: tableHeaders,
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 }
    });

    doc.save(`BattleBlast_Report_${filterRange}_${Date.now()}.pdf`);
  };

  const exportExcel = () => {
    const dataToExport = filteredBookings.map((b) => ({
      "Reservation ID": b.reservationId,
      "Customer Name": typeof b.user === "string" ? b.user : (b.user?.fullName || "Member"),
      "Customer Email": b.userEmail,
      "Sport": b.sport?.name || b.sport || "Sport",
      "Facility/Coach": b.court?.name || b.coach?.name || b.facility || "Facility",
      "Reservation Date": b.bookingDetails?.bookingDate || b.date || "-",
      "Time Slot": b.bookingDetails?.bookingTime || "-",
      "Duration": b.bookingDetails?.duration || "-",
      "Players": b.bookingDetails?.players || 1,
      "Status": b.status || "-",
      "Amount (LKR)": b.totalAmount || b.amount || 0,
      "Payment Method": b.paymentMethod || "-",
      "Created At": b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reservations");

    // Adjust column widths automatically
    const max_width = dataToExport.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
    worksheet["!cols"] = Array(max_width).fill({ wch: 18 });

    XLSX.writeFile(workbook, `BattleBlast_Report_${filterRange}_${Date.now()}.xlsx`);
  };

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

        <div className="reports-actions" style={{ display: "flex", gap: "10px" }}>
          <button className="download-report-btn" onClick={exportPDF} style={{ background: "#3b82f6" }}>
            <FileText size={15} style={{ marginRight: "6px" }} />
            Export PDF
          </button>
          <button className="download-report-btn" onClick={exportExcel} style={{ background: "#10b981" }}>
            <FileSpreadsheet size={15} style={{ marginRight: "6px" }} />
            Export Excel
          </button>
        </div>
      </div>

      <div className="reports-filter-strip" style={{
        display: "flex",
        gap: "10px",
        marginBottom: "25px",
        background: "rgba(255,255,255,0.02)",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.06)"
      }}>
        <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", fontSize: "14px", marginRight: "10px" }}>
          Filter Range:
        </span>
        {["all", "daily", "weekly", "monthly"].map((range) => (
          <button
            key={range}
            onClick={() => setFilterRange(range)}
            style={{
              background: filterRange === range ? "#3b82f6" : "rgba(255,255,255,0.05)",
              color: filterRange === range ? "#fff" : "#94a3b8",
              border: "none",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              textTransform: "capitalize",
              transition: "all 0.2s"
            }}
          >
            {range === "all" ? "All Time" : range}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>
          Loading reports data...
        </div>
      ) : (
        <>
          <div className="reports-stats-grid">
            <div className="reports-stat-card">
              <div className="reports-icon">
                <Wallet size={18} />
              </div>
              <span>Total Revenue</span>
              <h2>LKR {totalRevenue.toLocaleString()}</h2>
              <p>Reservation earnings</p>
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
                {sportUsage.map((sport) => (
                  <div className="summary-row" key={sport.name}>
                    <span>{sport.name} Bookings</span>
                    <strong>{sport.count}</strong>
                  </div>
                ))}
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
                {sportUsage.length > 0 ? (
                  sportUsage.map((sport) => (
                    <div key={sport.name}>
                      <div className="analytics-row">
                        <span>{sport.name} Usage</span>
                        <strong>{sport.percentage}%</strong>
                      </div>
                      <div className="analytics-bar">
                        <div
                          className="analytics-fill badminton-fill"
                          style={{
                            width: `${sport.percentage}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#64748b", fontSize: "14px" }}>No usage analytics available.</div>
                )}
              </div>
            </div>

            <div className="reports-card full-card">
              <div className="reports-card-header">
                <div>
                  <span className="reports-label">Revenue Overview</span>
                  <h2>Revenue Breakdown</h2>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
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
                    {filteredBookings.map((booking) => {
                      const customerName = typeof booking.user === "string" ? booking.user : (booking.user?.fullName || booking.userEmail);
                      const sportName = booking.sport?.name || booking.sport || "Sport";
                      const facilityName = booking.court?.name || booking.coach?.name || booking.facility || "Facility";
                      const amount = booking.totalAmount || booking.amount || 0;
                      
                      return (
                        <tr key={booking._id || booking.id}>
                          <td>{customerName}</td>
                          <td>{sportName}</td>
                          <td>{facilityName}</td>
                          <td>{booking.status}</td>
                          <td>LKR {amount.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminReports;
