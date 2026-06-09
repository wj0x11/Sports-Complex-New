import "../styles/notifications.css";

function Notifications() {
  const notifications = [
    {
      id: 1,

      title: "Booking Confirmed",

      message:
        "Your Basketball Court A booking has been confirmed successfully.",

      time: "5 Minutes Ago",

      status: "New",
    },

    {
      id: 2,

      title: "Payment Successful",

      message: "Your payment of LKR 4,500 has been received successfully.",

      time: "1 Hour Ago",

      status: "Read",
    },

    {
      id: 3,

      title: "Coach Session Reminder",

      message:
        "Your training session with Coach Kasun Perera starts tomorrow at 4PM.",

      time: "3 Hours Ago",

      status: "New",
    },

    {
      id: 4,

      title: "Court Maintenance",

      message:
        "Table Tennis Arena 2 will be unavailable due to scheduled maintenance.",

      time: "Yesterday",

      status: "Read",
    },
  ];

  return (
    <div className="notifications-page">
      <div className="container">
        <div className="notifications-header">
          <div>
            <h1 className="notifications-title">Notifications</h1>

            <p className="notifications-subtitle">
              Stay updated with bookings, payments, reminders, and sports
              complex announcements.
            </p>
          </div>

          <button className="mark-read-btn">Mark All As Read</button>
        </div>

        <div className="notifications-list">
          {notifications.map((notification) => (
            <div className="notification-card" key={notification.id}>
              <div className="notification-info">
                <h2>{notification.title}</h2>

                <p>{notification.message}</p>

                <span className="notification-time">{notification.time}</span>
              </div>

              <div
                className={`notification-status ${
                  notification.status === "New" ? "status-new" : "status-read"
                }`}
              >
                {notification.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
