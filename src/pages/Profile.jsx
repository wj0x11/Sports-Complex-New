import "../styles/profile.css";

function Profile() {
  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          <div className="profile-sidebar">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
              alt="Profile"
              className="profile-image"
            />

            <h1 className="profile-name">Kasun Perera</h1>

            <p className="profile-role">Premium Sports Member</p>

            <div className="profile-stats">
              <div className="profile-stat">
                <h2>12</h2>

                <p>Bookings</p>
              </div>

              <div className="profile-stat">
                <h2>5</h2>

                <p>Sessions</p>
              </div>

              <div className="profile-stat">
                <h2>3</h2>

                <p>Sports</p>
              </div>
            </div>
          </div>

          <div className="profile-main">
            <div className="profile-card">
              <h2 className="profile-card-title">Personal Information</h2>

              <div className="profile-form-grid">
                <div className="profile-group">
                  <label>First Name</label>

                  <input type="text" value="Kasun" />
                </div>

                <div className="profile-group">
                  <label>Last Name</label>

                  <input type="text" value="Perera" />
                </div>

                <div className="profile-group">
                  <label>Email Address</label>

                  <input type="email" value="kasun@gmail.com" />
                </div>

                <div className="profile-group">
                  <label>Phone Number</label>

                  <input type="text" value="+94 77 123 4567" />
                </div>

                <div className="profile-group">
                  <label>Preferred Sport</label>

                  <select>
                    <option>Basketball</option>

                    <option>Volleyball</option>

                    <option>Badminton</option>
                  </select>
                </div>

                <div className="profile-group">
                  <label>Membership Type</label>

                  <input type="text" value="Premium" />
                </div>
              </div>

              <button className="save-profile-btn">Save Changes</button>
            </div>

            <div className="profile-card">
              <h2 className="profile-card-title">Recent Activities</h2>

              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-info">
                    <h3>Basketball Court Booking</h3>

                    <p>24 May 2026 | 4PM - 6PM</p>
                  </div>

                  <div className="activity-status">Confirmed</div>
                </div>

                <div className="activity-item">
                  <div className="activity-info">
                    <h3>Coach Training Session</h3>

                    <p>26 May 2026 | 10AM</p>
                  </div>

                  <div className="activity-status">Completed</div>
                </div>

                <div className="activity-item">
                  <div className="activity-info">
                    <h3>Badminton Court Booking</h3>

                    <p>28 May 2026 | 6PM</p>
                  </div>

                  <div className="activity-status">Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
