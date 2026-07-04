import {
  CalendarDays,
  Search,
  Filter,
  Clock3,
  MapPin,
  Wallet,
  CheckCircle2,
  XCircle,
  RotateCw,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDashboardLayout from "../components/UserDashboardLayout";
import { useBooking } from "../context/BookingContext";
import { apiClient } from "../services/api/client";
import "../styles/bookingHistory.css";

function BookingHistory() {
  const navigate = useNavigate();
  const { authUser } = useBooking();

  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const currentUser = authUser || JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!currentUser?.email) return;
    apiClient.getUserBookings(currentUser.email)
      .then((data) => {
        setBookings(data);
      })
      .catch((err) => {
        console.error("Error loading user bookings from database:", err);
      });
  }, [currentUser?.email]);


  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking?.sport?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking?.court?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking?.coach?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === "All" ? true : booking.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [bookings, searchTerm, activeFilter]);

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "Confirmed",
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "Completed",
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "Cancelled",
  ).length;

  return (
    <UserDashboardLayout
      title="Booking History"
      subtitle="Track upcoming reservations, completed sessions, payment activity, and cancelled bookings."
    >
      <div className="history-topbar">
            <div className="history-search-box">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search bookings"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="history-filters">
              <button
                className={`filter-btn ${
                  activeFilter === "All" ? "active-filter" : ""
                }`}
                onClick={() => setActiveFilter("All")}
              >
                All
              </button>

              <button
                className={`filter-btn ${
                  activeFilter === "Confirmed" ? "active-filter" : ""
                }`}
                onClick={() => setActiveFilter("Confirmed")}
              >
                Confirmed
              </button>

              <button
                className={`filter-btn ${
                  activeFilter === "Completed" ? "active-filter" : ""
                }`}
                onClick={() => setActiveFilter("Completed")}
              >
                Completed
              </button>

              <button
                className={`filter-btn ${
                  activeFilter === "Cancelled" ? "active-filter" : ""
                }`}
                onClick={() => setActiveFilter("Cancelled")}
              >
                Cancelled
              </button>

              <button className="filter-icon-btn">
                <Filter size={16} />
              </button>
            </div>
          </div>

          <div className="history-layout">
            <div className="history-left-column">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking, index) => (
                  <div className="history-card" key={booking._id || booking.id || index}>
                    <div className="history-card-glow"></div>

                    <div className="history-card-top">
                      <div>
                        <span className="history-card-label">
                          Sports Reservation
                        </span>

                        <h2>{booking?.sport?.name} Booking</h2>
                      </div>

                      <div
                        className={`history-status ${
                          booking.status === "Confirmed"
                            ? "status-confirmed"
                            : booking.status === "Completed"
                              ? "status-completed"
                              : "status-cancelled"
                        }`}
                      >
                        {booking.status}
                      </div>
                    </div>

                    <div className="history-details-grid">
                      <div className="history-detail-item">
                        <div className="history-detail-icon">
                          <MapPin size={15} />
                        </div>

                        <div>
                          <span>Facility</span>

                          <h4>
                            {booking?.court?.name ||
                              booking?.coach?.name ||
                              "Sports Session"}
                          </h4>
                        </div>
                      </div>

                      <div className="history-detail-item">
                        <div className="history-detail-icon">
                          <CalendarDays size={15} />
                        </div>

                        <div>
                          <span>Date</span>

                          <h4>{booking?.bookingDetails?.bookingDate}</h4>
                        </div>
                      </div>

                      <div className="history-detail-item">
                        <div className="history-detail-icon">
                          <Clock3 size={15} />
                        </div>

                        <div>
                          <span>Time</span>

                          <h4>{booking?.bookingDetails?.bookingTime}</h4>
                        </div>
                      </div>

                      <div className="history-detail-item">
                        <div className="history-detail-icon">
                          <Wallet size={15} />
                        </div>

                        <div>
                          <span>Amount</span>

                          <h4>LKR {booking?.totalAmount?.toLocaleString()}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="history-card-actions">
                      <button className="view-details-btn">View Details</button>

                      <button
                        className="rebook-btn"
                        onClick={() =>
                          navigate(`/sports/${booking?.sport?.slug}`)
                        }
                      >
                        <RotateCw size={14} />
                        Rebook
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="history-card">
                  <div className="history-card-top">
                    <div>
                      <span className="history-card-label">
                        No Reservations
                      </span>

                      <h2>No booking history found</h2>
                    </div>
                  </div>

                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      lineHeight: "1.8",
                    }}
                  >
                    Your completed and upcoming reservations will appear here
                    after making bookings.
                  </p>
                </div>
              )}
            </div>

            <div className="history-right-column">
              <div className="history-summary-card">
                <span className="summary-badge">Reservation Summary</span>

                <h2>Booking Overview</h2>

                <div className="summary-stats">
                  <div className="summary-item">
                    <div className="summary-icon confirmed-icon">
                      <CheckCircle2 size={15} />
                    </div>

                    <div>
                      <h3>{confirmedCount}</h3>

                      <p>Confirmed</p>
                    </div>
                  </div>

                  <div className="summary-item">
                    <div className="summary-icon completed-icon">
                      <CalendarDays size={15} />
                    </div>

                    <div>
                      <h3>{completedCount}</h3>

                      <p>Completed</p>
                    </div>
                  </div>

                  <div className="summary-item">
                    <div className="summary-icon cancelled-icon">
                      <XCircle size={15} />
                    </div>

                    <div>
                      <h3>{cancelledCount}</h3>

                      <p>Cancelled</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="history-membership-card">
                <span className="membership-badge">
                  {currentUser?.membership || "Standard Membership"}
                </span>

                <h2>Premium Booking Access</h2>

                <p>
                  Priority reservations, exclusive discounts, and extended
                  booking schedules are enabled for your membership profile.
                </p>

                <div className="membership-footer">
                  Battle Blast Sports Complex
                </div>
              </div>
            </div>
          </div>
    </UserDashboardLayout>
  );
}

export default BookingHistory;
