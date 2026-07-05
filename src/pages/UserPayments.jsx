import { useEffect, useState } from "react";
import { Wallet, CheckCircle2, Clock3, XCircle } from "lucide-react";
import UserDashboardLayout from "../components/UserDashboardLayout";
import { useBooking } from "../context/BookingContext";
import { apiClient } from "../services/api/client";
import "../styles/userPayments.css";

function UserPayments() {
  const { authUser } = useBooking();
  const user = authUser || JSON.parse(localStorage.getItem("user") || "null");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(Boolean(user?.email));

  useEffect(() => {
    if (!user?.email) {
      return;
    }

    apiClient
      .getUserBookings(user.email)
      .then(setBookings)
      .catch((err) => console.error("Error loading payments:", err))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const totalPaid = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const getStatusClass = (status) => {
    if (status === "Completed") return "payment-status-completed";
    if (status === "Cancelled") return "payment-status-cancelled";
    return "payment-status-confirmed";
  };

  return (
    <UserDashboardLayout
      title="Payment History"
      subtitle="View all reservation payments and transaction details."
    >
      <div className="payments-stats">
        <div className="payments-stat-card ui-card">
          <Wallet size={20} />
          <span>Total Paid</span>
          <h2>LKR {totalPaid.toLocaleString()}</h2>
        </div>
        <div className="payments-stat-card ui-card">
          <CheckCircle2 size={20} />
          <span>Transactions</span>
          <h2>{bookings.length}</h2>
        </div>
      </div>

      {loading ? (
        <div className="ui-loading">Loading payment history...</div>
      ) : bookings.length === 0 ? (
        <div className="ui-empty-state">
          <h2>No payments yet</h2>
          <p>Your booking payments will appear here once you make a reservation.</p>
        </div>
      ) : (
        <div className="payments-table-wrap ui-card">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Sport</th>
                <th>Facility</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking._id || booking.id || index}>
                  <td>{booking?.sport?.name || "Sports Session"}</td>
                  <td>
                    {booking?.court?.name || booking?.coach?.name || "Session"}
                  </td>
                  <td>{booking?.bookingDetails?.bookingDate || "-"}</td>
                  <td className="payment-amount">
                    LKR {(booking.totalAmount || 0).toLocaleString()}
                  </td>
                  <td>
                    <span className={`payment-status ${getStatusClass(booking.status)}`}>
                      {booking.status === "Completed" && <CheckCircle2 size={12} />}
                      {booking.status === "Cancelled" && <XCircle size={12} />}
                      {!["Completed", "Cancelled"].includes(booking.status) && (
                        <Clock3 size={12} />
                      )}
                      {booking.status || "Confirmed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </UserDashboardLayout>
  );
}

export default UserPayments;
