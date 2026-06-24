import "../styles/settings.css";

function Settings() {
  return (
    <div className="settings-page">
      <div className="container">
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>

          <p className="settings-subtitle">
            Manage notifications, preferences, and account settings for your
            sports complex experience.
          </p>
        </div>

        <div className="settings-grid">
          <div className="settings-card">
            <h2>Notifications</h2>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Email Notifications</h3>

                <p>Receive booking and payment updates via email.</p>
              </div>

              <div className="toggle-btn">
                <div className="toggle-circle"></div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>SMS Alerts</h3>

                <p>Receive sports session reminders through SMS.</p>
              </div>

              <div className="toggle-btn">
                <div className="toggle-circle"></div>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <h2>Preferences</h2>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Dark Mode</h3>

                <p>Enable dark interface mode for better viewing experience.</p>
              </div>

              <div className="toggle-btn">
                <div className="toggle-circle"></div>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Language</h3>

                <p>English (Sri Lanka)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
