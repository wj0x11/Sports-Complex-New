import { useEffect, useState } from "react";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { apiClient } from "../services/api/client";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import "../styles/manageBookings.css";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = () => {
    setLoading(true);
    apiClient.getAdminOverview()
      .then((data) => {
        
        const bookingsList = Array.isArray(data) ? data : (data?.bookings || []);
        setBookings(bookingsList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading bookings:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const abortController = new AbortController();
    apiClient.getAdminOverview()
      .then((data) => {
        const bookingsList = Array.isArray(data) ? data : (data?.bookings || []);
        setBookings(bookingsList);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error("Error loading bookings:", err);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => abortController.abort();
  }, []);

  const handleUpdateStatus = (bookingId, status) => {
    apiClient.updateBookingStatus(bookingId, status)
      .then(() => {
        loadBookings();
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  return (
    <AdminDashboardLayout
      title="Manage Bookings"
      subtitle="Monitor court reservations, booking status, and customer activities."
    >
        {loading ? (
          <div className="ui-loading">Loading bookings from database...</div>
        ) : bookings.length > 0 ? (
          <div className="bookings-table-container ui-card">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Reservation ID</th>
                  <th>User</th>
                  <th>Sport</th>
                  <th>Facility/Coach</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                 
                  const resId = booking.reservationId || booking.id || booking._id || "-";
                  const userName = booking.user?.fullName || booking.userEmail || "Customer";
                  const sportName = booking.sport?.name || booking.sport || "-";
                  const facilityName = booking.court?.name || booking.coach?.name || "Session";
                  const bookingDate = booking.bookingDetails?.bookingDate || booking.date || "-";
                  const bookingTime = booking.bookingDetails?.bookingTime || booking.time || "";
                  const amount = booking.totalAmount || booking.amount || 0;
                  const status = booking.status || "Pending";
                  const targetId = booking.id || booking._id;

                  return (
                    <tr key={booking._id || booking.id}>
                      <td style={{ fontWeight: "bold", color: "#3b82f6" }}>{resId}</td>
                      <td>{userName}</td>
                      <td>{sportName}</td>
                      <td>{facilityName}</td>
                      <td>{bookingDate} {bookingTime && `(${bookingTime})`}</td>
                      <td>LKR {amount.toLocaleString()}</td>
                      <td>
                        <span
                          className={`booking-status ${
                            status === "Confirmed" || status === "Approved"
                              ? "status-confirmed"
                              : status === "Completed"
                                ? "status-completed"
                                : "status-cancelled"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className="booking-action-buttons" style={{ display: "flex", gap: "8px" }}>
                          <button
                            className="approve-btn"
                            style={{
                              background: "rgba(16, 185, 129, 0.1)",
                              color: "#10b981",
                              border: "none",
                              padding: "6px",
                              borderRadius: "6px",
                              cursor: "pointer"
                            }}
                            onClick={() => handleUpdateStatus(targetId, "Confirmed")}
                            title="Confirm Booking"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                          <button
                            className="complete-btn"
                            style={{
                              background: "rgba(59, 130, 246, 0.1)",
                              color: "#3b82f6",
                              border: "none",
                              padding: "6px",
                              borderRadius: "6px",
                              cursor: "pointer"
                            }}
                            onClick={() => handleUpdateStatus(targetId, "Completed")}
                            title="Complete Booking"
                          >
                            <ShieldCheck size={14} />
                          </button>
                          <button
                            className="cancel-btn"
                            style={{
                              background: "rgba(239, 68, 68, 0.1)",
                              color: "#ef4444",
                              border: "none",
                              padding: "6px",
                              borderRadius: "6px",
                              cursor: "pointer"
                            }}
                            onClick={() => handleUpdateStatus(targetId, "Cancelled")}
                            title="Cancel Booking"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ui-empty-state">
            <h2>No bookings found</h2>
            <p>Create a new booking from the Member Portal to see it here.</p>
          </div>
        )}
    </AdminDashboardLayout>
  );
}

export default ManageBookings;
