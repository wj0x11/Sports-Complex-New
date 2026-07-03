import { useEffect, useState } from "react";
import { apiClient } from "../services/api/client";
import "../styles/manageUsers.css";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    apiClient.getUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading users:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      apiClient.deleteUser(userId)
        .then(() => {
          loadUsers();
        })
        .catch((err) => {
          console.error("Error deleting user:", err);
        });
    }
  };

  return (
    <div className="manage-users-page">
      <div className="container">
        <div className="manage-users-header">
          <div>
            <h1 className="manage-users-title">Manage Users</h1>

            <p className="manage-users-subtitle">
              Manage customer accounts, admin access, and user information.
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>
            Loading user accounts from database...
          </div>
        ) : users.length > 0 ? (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.fullName || user.name || "Member"}</td>

                    <td>{user.email}</td>

                    <td>{user.phone || "-"}</td>

                    <td>
                      <span
                        className={`user-role ${
                          user.role === "admin" ? "role-admin" : "role-user"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
                    </td>

                    <td>
                      <div className="user-actions">
                        {user.email !== "admin@gmail.com" ? (
                          <button
                            className="delete-user-btn"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </button>
                        ) : (
                          <span style={{ color: "#64748b", fontSize: "12px" }}>System Admin</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            color: "#64748b",
            textAlign: "center",
            padding: "40px",
            background: "rgba(255, 255, 255, 0.03)",
            borderRadius: "12px"
          }}>
            No users found in database.
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;
