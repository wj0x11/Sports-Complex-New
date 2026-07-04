import { useEffect, useState } from "react";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
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
    <AdminDashboardLayout
      title="Manage Users"
      subtitle="Manage customer accounts, admin access, and user information."
    >
        {loading ? (
          <div className="ui-loading">Loading user accounts from database...</div>
        ) : users.length > 0 ? (
          <div className="users-table-container ui-card">
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
          <div className="ui-empty-state">
            <h2>No users found</h2>
            <p>No user accounts in the database yet.</p>
          </div>
        )}
    </AdminDashboardLayout>
  );
}

export default ManageUsers;
