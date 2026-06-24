import "../styles/manageUsers.css";

function ManageUsers() {
  const users = [
    {
      id: 1,

      name: "Kasun Perera",

      email: "kasun@gmail.com",

      phone: "+94 77 123 4567",

      role: "User",
    },

    {
      id: 2,

      name: "Nimal Silva",

      email: "nimal@gmail.com",

      phone: "+94 71 456 8899",

      role: "Admin",
    },

    {
      id: 3,

      name: "Ashen Fernando",

      email: "ashen@gmail.com",

      phone: "+94 76 222 4567",

      role: "User",
    },

    {
      id: 4,

      name: "Dilshan Jayasuriya",

      email: "dilshan@gmail.com",

      phone: "+94 75 888 1122",

      role: "User",
    },
  ];

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

          <button className="add-user-btn">Add User</button>
        </div>
        <div className="users-stats">
          <div className="user-stat-card">
            <h3>4</h3>
            <span>Total Users</span>
          </div>

          <div className="user-stat-card">
            <h3>3</h3>
            <span>Members</span>
          </div>

          <div className="user-stat-card">
            <h3>1</h3>
            <span>Administrators</span>
          </div>

          <div className="user-stat-card">
            <h3>100%</h3>
            <span>Active Accounts</span>
          </div>
        </div>

        <div className="users-search">
          <input type="text" placeholder="Search users..." />
        </div>
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
                <tr key={user.id}>
                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>{user.phone}</td>

                  <td>
                    <span
                      className={`user-role ${
                        user.role === "Admin" ? "role-admin" : "role-user"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <div className="user-actions">
                      <button className="edit-user-btn">Edit</button>

                      <button className="delete-user-btn">Delete</button>
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

export default ManageUsers;
