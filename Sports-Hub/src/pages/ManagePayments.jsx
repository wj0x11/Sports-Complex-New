import "../styles/managePayments.css";

function ManagePayments() {
  const payments = [
    {
      id: 1,

      customer: "Kasun Perera",

      method: "Card Payment",

      amount: "LKR 4,500",

      date: "24 May 2026",

      status: "Success",
    },

    {
      id: 2,

      customer: "Nimal Silva",

      method: "Cash Payment",

      amount: "LKR 2,000",

      date: "25 May 2026",

      status: "Pending",
    },

    {
      id: 3,

      customer: "Ashen Fernando",

      method: "Bank Transfer",

      amount: "LKR 5,500",

      date: "26 May 2026",

      status: "Failed",
    },

    {
      id: 4,

      customer: "Dilshan Jayasuriya",

      method: "eZ Cash",

      amount: "LKR 1,800",

      date: "27 May 2026",

      status: "Success",
    },
  ];

  return (
    <div className="manage-payments-page">
      <div className="container">
        <div className="manage-payments-header">
          <div>
            <h1 className="manage-payments-title">Manage Payments</h1>

            <p className="manage-payments-subtitle">
              Track customer transactions, payment methods, and revenue
              analytics.
            </p>
          </div>
        </div>

        <div className="payments-overview">
          <div className="payment-overview-card">
            <p className="payment-overview-title">Monthly Revenue</p>

            <h2 className="payment-overview-value">LKR 245K</h2>
          </div>

          <div className="payment-overview-card">
            <p className="payment-overview-title">Successful Payments</p>

            <h2 className="payment-overview-value">128</h2>
          </div>

          <div className="payment-overview-card">
            <p className="payment-overview-title">Pending Payments</p>

            <h2 className="payment-overview-value">12</h2>
          </div>

          <div className="payment-overview-card">
            <p className="payment-overview-title">Refund Requests</p>

            <h2 className="payment-overview-value">4</h2>
          </div>
        </div>

        <div className="payments-table-container">
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
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.customer}</td>

                  <td>{payment.method}</td>

                  <td>{payment.amount}</td>

                  <td>{payment.date}</td>

                  <td>
                    <span
                      className={`payment-status ${
                        payment.status === "Success"
                          ? "payment-success"
                          : payment.status === "Pending"
                            ? "payment-pending"
                            : "payment-failed"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>

                  <td>
                    <div className="payment-action-buttons">
                      <button className="view-payment-btn">View</button>

                      <button className="refund-btn">Refund</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManagePayments;
