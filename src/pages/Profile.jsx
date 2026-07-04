import { useEffect, useState } from "react";
import UserDashboardLayout from "../components/UserDashboardLayout";
import { useBooking } from "../context/BookingContext";
import { apiClient } from "../services/api/client";
import { getFeaturedSports } from "../services/sports.service";
import "../styles/profile.css";

function Profile() {
  const { authUser } = useBooking();
  const user = authUser || JSON.parse(localStorage.getItem("user") || "null");
  const featuredSports = getFeaturedSports();

  const [bookings, setBookings] = useState([]);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredSport: "",
    membership: "Standard",
  });

  useEffect(() => {
    if (!user) return;

    const fullName = user.fullName || user.name || "";
    const nameParts = fullName.split(" ");

    setForm({
      firstName: user.firstName || nameParts[0] || "",
      lastName: user.lastName || nameParts.slice(1).join(" ") || "",
      email: user.email || "",
      phone: user.phone || user.phoneNumber || "",
      preferredSport: user.preferredSport || featuredSports[0]?.name || "",
      membership: user.membership || "Standard",
    });

    if (user.email) {
      apiClient
        .getUserBookings(user.email)
        .then(setBookings)
        .catch((err) => console.error("Error loading profile bookings:", err));
    }
  }, [user]);

  const uniqueSports = new Set(
    bookings.map((b) => b?.sport?.name).filter(Boolean),
  ).size;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      firstName: form.firstName,
      lastName: form.lastName,
      fullName: `${form.firstName} ${form.lastName}`.trim(),
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      phone: form.phone,
      preferredSport: form.preferredSport,
      membership: form.membership,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setSaved(true);
  };

  const displayName = form.firstName
    ? `${form.firstName} ${form.lastName}`.trim()
    : "Member";

  return (
    <UserDashboardLayout
      title="My Profile"
      subtitle="Manage your personal information and view recent activity."
    >
      <div className="profile-container">
        <div className="profile-sidebar ui-card">
          <div className="profile-avatar-large">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <h1 className="profile-name">{displayName}</h1>
          <p className="profile-role">{form.membership} Member</p>

          <div className="profile-stats">
            <div className="profile-stat">
              <h2>{bookings.length}</h2>
              <p>Bookings</p>
            </div>
            <div className="profile-stat">
              <h2>
                {bookings.filter((b) => b.status === "Completed").length}
              </h2>
              <p>Sessions</p>
            </div>
            <div className="profile-stat">
              <h2>{uniqueSports}</h2>
              <p>Sports</p>
            </div>
          </div>
        </div>

        <div className="profile-main">
          <div className="profile-card ui-card">
            <h2 className="profile-card-title">Personal Information</h2>

            <div className="profile-form-grid">
              <div className="profile-group">
                <label className="ui-label">First Name</label>
                <input
                  type="text"
                  className="ui-input"
                  value={form.firstName}
                  onChange={handleChange("firstName")}
                />
              </div>

              <div className="profile-group">
                <label className="ui-label">Last Name</label>
                <input
                  type="text"
                  className="ui-input"
                  value={form.lastName}
                  onChange={handleChange("lastName")}
                />
              </div>

              <div className="profile-group">
                <label className="ui-label">Email Address</label>
                <input
                  type="email"
                  className="ui-input"
                  value={form.email}
                  readOnly
                />
              </div>

              <div className="profile-group">
                <label className="ui-label">Phone Number</label>
                <input
                  type="text"
                  className="ui-input"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="+94 77 123 4567"
                />
              </div>

              <div className="profile-group">
                <label className="ui-label">Preferred Sport</label>
                <select
                  className="ui-select"
                  value={form.preferredSport}
                  onChange={handleChange("preferredSport")}
                >
                  {featuredSports.map((sport) => (
                    <option key={sport.id} value={sport.name}>
                      {sport.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="profile-group">
                <label className="ui-label">Membership Type</label>
                <input
                  type="text"
                  className="ui-input"
                  value={form.membership}
                  readOnly
                />
              </div>
            </div>

            <button type="button" className="save-profile-btn btn-primary" onClick={handleSave}>
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>

          <div className="profile-card ui-card">
            <h2 className="profile-card-title">Recent Activities</h2>

            <div className="activity-list">
              {bookings.length > 0 ? (
                bookings.slice(0, 5).map((booking, index) => (
                  <div className="activity-item" key={booking._id || booking.id || index}>
                    <div className="activity-info">
                      <h3>
                        {booking?.sport?.name || "Sports"} Booking
                      </h3>
                      <p>
                        {booking?.bookingDetails?.bookingDate} |{" "}
                        {booking?.bookingDetails?.bookingTime}
                      </p>
                    </div>
                    <div className="activity-status">{booking.status || "Confirmed"}</div>
                  </div>
                ))
              ) : (
                <div className="ui-empty-state" style={{ padding: "30px" }}>
                  <p>No recent activities yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}

export default Profile;
