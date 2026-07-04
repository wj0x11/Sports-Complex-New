import { useEffect, useState } from "react";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { apiClient } from "../services/api/client";
import "../styles/managePayments.css";

function ManagePayments() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = () => {
    apiClient.getAdminOverview()
      .then((overview) => {
        setBookings(overview.bookings);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading payments:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const totalRevenue = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 0);

  const successfulPayments = bookings.filter((b) => b.status !== "Cancelled").length;
  const pendingPayments = bookings.filter((b) => b.status === "Pending").length;
  const refundedCount = bookings.filter((b) => b.status === "Cancelled").length;

  const handleRefund = (bookingId) => {
    if (window.confirm("Are you sure you want to refund and cancel this payment?")) {
      apiClient.updateBookingStatus(bookingId, "Cancelled")
        .then(() => {
          loadPayments();
        })
        .catch((err) => console.error("Error refunding payment:", err));
    }
  };

  return (
    <AdminDashboardLayout
      title="Manage Payments"
      subtitle="Track customer transactions, payment methods, and revenue analytics."
    >
        <div className="payments-overview">
          <div className="payment-overview-card">
            <p className="payment-overview-title">Total Revenue</p>

            <h2 className="payment-overview-value">LKR {totalRevenue.toLocaleString()}</h2>
          </div>

          <div className="payment-overview-card">
            <p className="payment-overview-title">Successful Payments</p>

            <h2 className="payment-overview-value">{successfulPayments}</h2>
          </div>

          <div className="payment-overview-card">
            <p className="payment-overview-title">Pending Payments</p>

            <h2 className="payment-overview-value">{pendingPayments}</h2>
          </div>

          <div className="payment-overview-card">
            <p className="payment-overview-title">Refunded / Cancelled</p>

            <h2 className="payment-overview-value">{refundedCount}</h2>
          </div>
        </div>

        {loading ? (
          <div className="ui-loading">Loading payments database...</div>
        ) : bookings.length > 0 ? (
          <div className="payments-table-container ui-card">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => {
                  const customerName = typeof booking.user === "string" ? booking.user : (booking.user?.fullName || booking.userEmail);
                  const method = booking.paymentMethod || "Card Payment";
                  const amount = booking.totalAmount || booking.amount || 0;
                  const date = booking.bookingDetails?.bookingDate || booking.date || "-";
                  const status = booking.status === "Cancelled" ? "Refunded" : "Success";
                  
                  return (
                    <tr key={booking._id || booking.id}>
                      <td>{customerName}</td>
                      <td>{method}</td>
                      <td>LKR {amount.toLocaleString()}</td>
                      <td>{date}</td>
                      <td>
                        <span
                          className={`payment-status ${
                            status === "Success"
                              ? "payment-success"
                              : status === "Pending"
                                ? "payment-pending"
                                : "payment-failed"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className="payment-action-buttons">
                          {status !== "Refunded" && (
                            <button
                              className="refund-btn"
                              onClick={() => handleRefund(booking.id)}
                            >
                              Refund
                            </button>
                          )}
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
            <h2>No payment history</h2>
            <p>Payment records will appear here once bookings are made.</p>
          </div>
        )}
    </AdminDashboardLayout>
  );
}

export default ManagePayments;
