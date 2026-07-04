import { useState } from "react";
import AdminDashboardLayout from "../components/AdminDashboardLayout";
import { getAdminSportSummaries } from "../services/sports.service";
import axios from "axios";
import "../styles/manageSports.css";

function ManageSports() {
  const [sports, setSports] = useState(() => getAdminSportSummaries());

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("court");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setError] = useState("");

 
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/sports", {
        name, description, type,
        image: image || "https://images.unsplash.com/photo-1517649763962-0c623066013b",
        isDisabled: false
      });
      if (response.status === 200 || response.status === 201) {
        setSports([...sports, response.data]);
        closeAddModal();
      }
    } catch {
      setError("Failed to add sport.");
    } finally { setLoading(false); }
  };


  const openEditModal = (sport) => {
    setSelectedSport(sport);
    setName(sport.name);
    setDescription(sport.description);
    setType(sport.type);
    setImage(sport.image);
    setIsEditModalOpen(true);
  };


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/sports/${selectedSport.id || selectedSport._id}`, {
        name, description, type, image
      });
      
      if (response.status === 200) {
 
        setSports(sports.map(s => (s.id === selectedSport.id || s._id === selectedSport._id) ? response.data : s));
        setIsEditModalOpen(false);
      }
    } catch {
      setError("Failed to update sport.");
    } finally { setLoading(false); }
  };


  const handleToggleDisable = async (sport) => {
    const currentStatus = sport.isDisabled || false;
    const confirmMsg = currentStatus 
      ? `Do you want to ENABLE ${sport.name}?` 
      : `Do you want to DISABLE ${sport.name}?`;

    if (!window.confirm(confirmMsg)) return;

    try {

      const response = await axios.patch(`http://localhost:5000/api/sports/${sport.id || sport._id}/toggle-status`, {
        isDisabled: !currentStatus
      });

      if (response.status === 200) {
    
        setSports(sports.map(s => 
          (s.id === sport.id || s._id === sport._id) ? { ...s, isDisabled: !currentStatus } : s
        ));
      }
    } catch  {
      alert("Failed to change sport status. Connecting to local preview fallback.");
      
      setSports(sports.map(s => 
        (s.id === sport.id || s._id === sport._id) ? { ...s, isDisabled: !currentStatus } : s
      ));
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setName(""); setDescription(""); setType("court"); setImage("");
  };

  return (
    <AdminDashboardLayout
      title="Manage Sports"
      subtitle="Manage courts, coaches, schedules, and equipment across all sports facilities."
    >
        <div className="manage-toolbar">
          <button type="button" className="add-sport-btn btn-primary" onClick={() => setIsAddModalOpen(true)}>Add New Sport</button>
        </div>

        <div className="sports-management-grid">
          {sports.map((sport) => (
            <div 
              className="manage-sport-card" 
              key={sport.id || sport._id}
              style={{ opacity: sport.isDisabled ? 0.6 : 1, transition: "0.3s" }}
            >
              <img src={sport.image} alt={sport.name} className="manage-sport-image" />

              <div className="manage-sport-content">
                <span className="sport-tag">
                  {sport.featured ? "Featured" : "Standard"} · {sport.type} {sport.isDisabled && <b style={{color: 'red'}}> (Disabled)</b>}
                </span>
                <h2 className="manage-sport-title">{sport.name}</h2>
                <p className="manage-sport-description">{sport.description}</p>

                <div className="manage-sport-stats">
                  <div className="sport-stat-box">
                    <h3>{sport.courtsCount || 0}</h3>
                    <span>{sport.type === "court" ? "Facilities" : "Sessions"}</span>
                  </div>
                  <div className="sport-stat-box">
                    <h3>{sport.coachesCount || 0}</h3>
                    <span>Coaches</span>
                  </div>
                  <div className="sport-stat-box">
                    <h3>{sport.equipmentCount || 0}</h3>
                    <span>Equipment</span>
                  </div>
                </div>

                <div className="manage-sport-actions">
                
                  <button className="edit-btn" onClick={() => openEditModal(sport)}>Manage</button>
                  
                 
                  <button 
                    className="delete-btn" 
                    onClick={() => handleToggleDisable(sport)}
                    style={{ 
                      backgroundColor: sport.isDisabled ? "#22c55e" : "#fee2e2", 
                      color: sport.isDisabled ? "#fff" : "#ef4444" 
                    }}
                  >
                    {sport.isDisabled ? "Enable" : "Disable"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      {isAddModalOpen && (
        <div className="modal-overlay" style={modalOverlayStyle}>
          <div className="modal-content" style={modalContentStyle}>
            <h2 style={{ color: "#f8fafc", marginBottom: "20px" }}>Add New Sport</h2>
            <form onSubmit={handleAddSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Sport Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Facility Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
                  <option value="court">Court</option>
                  <option value="field">Field</option>
                  <option value="table">Table</option>
                  <option value="ring">Ring</option>
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Image URL</label>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" style={inputStyle}></textarea>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={closeAddModal} style={cancelBtnStyle}>Cancel</button>
                <button type="submit" disabled={loading} style={saveBtnStyle}>{loading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {isEditModalOpen && (
        <div className="modal-overlay" style={modalOverlayStyle}>
          <div className="modal-content" style={modalContentStyle}>
            <h2 style={{ color: "#f8fafc", marginBottom: "20px" }}>Manage Sport (Edit)</h2>
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Sport Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Facility Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
                  <option value="court">Court</option>
                  <option value="field">Field</option>
                  <option value="table">Table</option>
                  <option value="ring">Ring</option>
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Image URL</label>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" style={inputStyle}></textarea>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={cancelBtnStyle}>Cancel</button>
                <button type="submit" disabled={loading} style={saveBtnStyle}>{loading ? "Updating..." : "Update Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}


const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.75)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 };
const modalContentStyle = { backgroundColor: "#111827", padding: "30px", borderRadius: "16px", width: "100%", maxWidth: "480px", border: "1px solid #1f2937" };
const labelStyle = { display: "block", color: "#94a3b8", marginBottom: "5px", fontSize: "14px" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #374151", backgroundColor: "#1f2937", color: "#fff" };
const cancelBtnStyle = { backgroundColor: "#374151", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "8px", cursor: "pointer" };
const saveBtnStyle = { backgroundColor: "#72b01d", color: "#fff", border: "none", padding: "10px 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" };

export default ManageSports;
