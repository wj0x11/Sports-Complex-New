import "../styles/manageBookings.css";

function ManageBookings() {
  const bookings = [
    {
      id: 1,

      user: "Kasun Perera",

      sport: "Basketball",

      court: "Court A",

      date: "24 May 2026",

      amount: "LKR 4,500",

      status: "Confirmed",
    },

    {
      id: 2,

      user: "Nimal Silva",

      sport: "Badminton",

      court: "Court 1",

      date: "25 May 2026",

      amount: "LKR 2,000",

      status: "Pending",
    },

    {
      id: 3,

      user: "Ashen Fernando",

      sport: "Volleyball",

      court: "Main Court",

      date: "26 May 2026",

      amount: "LKR 5,500",

      status: "Cancelled",
    },

    {
      id: 4,

      user: "Dilshan Jayasuriya",

      sport: "Table Tennis",

      court: "Arena 2",

      date: "27 May 2026",

      amount: "LKR 1,800",

      status: "Confirmed",
    },
  ];

  return (
    <div className="manage-bookings-page">
      <div className="container">
        <div className="manage-bookings-header">
          <div>
            <h1 className="manage-bookings-title">Manage Bookings</h1>

            <p className="manage-bookings-subtitle">
              Monitor court reservations, booking status, and customer
              activities.
            </p>
          </div>
        </div>

        <div className="booking-stats">
          <div className="booking-stat-card">
            <h3>4</h3>
            <span>Total Bookings</span>
          </div>

          <div className="booking-stat-card">
            <h3>2</h3>
            <span>Confirmed</span>
          </div>

          <div className="booking-stat-card">
            <h3>1</h3>
            <span>Pending</span>
          </div>

          <div className="booking-stat-card">
            <h3>LKR 13,800</h3>
            <span>Total Revenue</span>
          </div>
        </div>

        <div className="bookings-search">
          <input type="text" placeholder="Search bookings..." />
        </div>

        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>User</th>

                <th>Sport</th>

                <th>Court</th>

                <th>Date</th>

                <th>Amount</th>

                <th>Status</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.user}</td>

                  <td>{booking.sport}</td>

                  <td>{booking.court}</td>

                  <td>{booking.date}</td>

                  <td>{booking.amount}</td>

                  <td>
                    <span
                      className={`booking-status ${
                        booking.status === "Confirmed"
                          ? "status-confirmed"
                          : booking.status === "Pending"
                            ? "status-pending"
                            : "status-cancelled"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td>
                    <div className="booking-action-buttons">
                      <button className="view-booking-btn">View</button>

                      <button className="approve-booking-btn">Approve</button>

                      <button className="delete-booking-btn">Cancel</button>
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

export default ManageBookings;
