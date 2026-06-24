import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useBooking } from "../context/BookingContext";
import { apiClient } from "../../../src/services/api/client";

import "../styles/sportDetails.css";

function SportDetails() {
  const { sportSlug } = useParams();

  const navigate = useNavigate();

  const {
    selectedCourt,
    setSelectedCourt,

    selectedCoach,
    setSelectedCoach,

    setSelectedSport,

    bookingDetails,
    setBookingDetails,
  } = useBooking();

  const [selectedDate, setSelectedDate] = useState(
    bookingDetails.bookingDate || "",
  );

  const [selectedSlot, setSelectedSlot] = useState(
    bookingDetails.bookingTime || "",
  );

  const [activeCoach, setActiveCoach] = useState(null);
  const [sport, setSport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uiMessage, setUiMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    apiClient
      .getSportBySlug(sportSlug)
      .then(setSport)
      .finally(() => setLoading(false));
  }, [sportSlug]);

  if (loading) {
    return (
      <div className="container">
        <h1>Loading sport details...</h1>
      </div>
    );
  }

  if (!sport) {
    return (
      <div className="container">
        <h1>Sport Not Found</h1>
      </div>
    );
  }

  const isTableTennis = sport.slug === "table-tennis";

  const isCourtSport =
    sport.slug === "badminton" ||
    sport.slug === "basketball" ||
    sport.slug === "volleyball";
  const getDayName = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString)
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();
  };

  const availableSlots = useMemo(() => {
    if (!selectedDate || isTableTennis) return [];

    const selectedDay = getDayName(selectedDate);

    const timetable = sport.timetable?.[selectedDay];

    if (!timetable) return [];

    const allSlots = [...timetable.morning, ...timetable.evening];

    if (!selectedCourt) return [];

    const bookedSlots =
      sport.bookedSlots?.[selectedDate]?.[selectedCourt.id] || [];

    return allSlots.map((slot) => ({
      slot,
      status: bookedSlots.includes(slot) ? "Booked" : "Available",
    }));
  }, [selectedDate, selectedCourt, sport, isTableTennis]);

  const handleCourtSelect = (court) => {
    setSelectedSport(sport);

    if (selectedCourt?.id === court.id) {
      setSelectedCourt(null);
      return;
    }

    setSelectedCourt(court);
  };

  const openCoachModal = (coach) => {
    setSelectedSport(sport);

    setActiveCoach(coach);

    setSelectedCoach(coach);

    setSelectedSlot("");

    setSelectedDate("");
  };

  const closeCoachModal = () => {
    setActiveCoach(null);

    setSelectedDate("");

    setSelectedSlot("");
  };

  const handleCoachBooking = () => {
    if (!selectedDate) {
      setUiMessage("Please select a reservation date.");

      return;
    }

    if (isTableTennis) {
      setSelectedCourt({
        id: activeCoach.id,
        name: activeCoach.assignedTable,
      });

      setBookingDetails({
        ...bookingDetails,
        bookingDate: selectedDate,
        bookingTime: activeCoach.assignedSession,
      });
    } else {
      if (!selectedSlot) {
        setUiMessage("Please select a time slot.");

        return;
      }

      setBookingDetails({
        ...bookingDetails,
        bookingDate: selectedDate,
        bookingTime: selectedSlot,
      });
    }

    navigate("/booking-form");
  };

  const handleContinue = () => {
    setSelectedSport(sport);

    if (!selectedCourt) {
      setUiMessage("Please select a court.");

      return;
    }

    if (!selectedDate) {
      setUiMessage("Please select a reservation date.");

      return;
    }

    if (!selectedSlot) {
      setUiMessage("Please select an available time slot.");

      return;
    }

    setBookingDetails({
      ...bookingDetails,
      bookingDate: selectedDate,
      bookingTime: selectedSlot,
    });

    navigate("/booking-form");
  };

  return (
    <div className="sport-details-page">
      <div className="container">
        <div className="sport-hero">
          <div className="hero-content-wrapper">
            <span className="hero-sport-type">{sport.category}</span>

            <h1 className="sport-hero-title">{sport.name}</h1>

            <p className="sport-hero-text">{sport.description}</p>
          </div>
        </div>
        {uiMessage && <div className="details-inline-message">{uiMessage}</div>}
        {sport.slug === "badminton" && (
          <div className="timetable-section">
            <div className="section-header">
              <div>
                <span className="section-badge">Weekly Schedule</span>

                <h2 className="details-title">{sport.name} Timetable</h2>
              </div>
            </div>

            <div className="timetable-card">
              <div className="timetable-head">
                <div>Day</div>

                <div>Morning Session</div>

                <div>Evening Session</div>
              </div>

              {Object.entries(sport.timetable).map(([day, sessions]) => (
                <div className="timetable-row" key={day}>
                  <div className="day-name">{day}</div>

                  <div>
                    {sessions.morning.map((slot, index) => (
                      <span className="time-slot-text" key={index}>
                        {slot}
                      </span>
                    ))}
                  </div>

                  <div>
                    {sessions.evening.map((slot, index) => (
                      <span className="time-slot-text" key={index}>
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isCourtSport && (
          <div className="details-section">
            <div className="section-header">
              <div>
                <span className="section-badge">Sports Courts</span>

                <h2 className="details-title">Select Court</h2>
              </div>
            </div>

            <div className="details-grid">
              {sport.courts.map((court) => (
                <div
                  className={`details-card ${
                    selectedCourt?.id === court.id ? "selected-card" : ""
                  }`}
                  key={court.id}
                >
                  <div className="card-premium-glow"></div>

                  <div className="card-premium-badge">Indoor Court</div>

                  <h3 className="card-title">{court.name}</h3>

                  <div className="card-info-list">
                    <div className="card-info-row">
                      <span>Hourly Rate</span>

                      <strong>LKR {court.pricePerHour}</strong>
                    </div>

                    <div className="card-info-row">
                      <span>Capacity</span>

                      <strong>{court.capacity}</strong>
                    </div>
                  </div>

                  <button
                    className="action-btn"
                    onClick={() => handleCourtSelect(court)}
                  >
                    {selectedCourt?.id === court.id
                      ? "Selected"
                      : "Select Court"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="details-section">
          <div className="section-header">
            <div>
              <span className="section-badge">Professional Coaches</span>

              <h2 className="details-title">
                {isTableTennis ? "Select Coach Session" : "Optional Coaching"}
              </h2>
            </div>
          </div>

          <div className="details-grid">
            {sport.coaches.map((coach) => (
              <div className="details-card" key={coach.id}>
                <div className="card-premium-glow"></div>

                <div className="card-image-placeholder">Coach Image</div>

                <div className="card-premium-badge">Certified Coach</div>

                <h3 className="card-title">{coach.name}</h3>

                <div className="card-info-list">
                  <div className="card-info-row">
                    <span>Experience</span>

                    <strong>{coach.experience}</strong>
                  </div>

                  <div className="card-info-row">
                    <span>Rating</span>

                    <strong>{coach.rating}</strong>
                  </div>

                  <div className="card-info-row">
                    <span>Speciality</span>

                    <strong>{coach.speciality}</strong>
                  </div>

                  <div className="card-info-row">
                    <span>Session Fee</span>

                    <strong>LKR {coach.price}</strong>
                  </div>

                  {isTableTennis && (
                    <>
                      <div className="card-info-row">
                        <span>Assigned Table</span>

                        <strong>{coach.assignedTable}</strong>
                      </div>

                      <div className="card-info-row">
                        <span>Session</span>

                        <strong>{coach.assignedSession}</strong>
                      </div>
                    </>
                  )}
                </div>

                <button
                  className="action-btn"
                  onClick={() => openCoachModal(coach)}
                >
                  {isTableTennis ? "Reserve Session" : "View Coach"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="details-section">
          <div className="section-header">
            <div>
              <span className="section-badge">Equipment Rental</span>
              <h2 className="details-title">Available Equipment</h2>
            </div>
          </div>
          <div className="equipment-grid">
            {(sport.equipment || []).map((item) => (
              <div className="equipment-card" key={item.id}>
                <h3>{item.name}</h3>
                <div className="equipment-meta">
                  <span>LKR {item.rentalPrice.toLocaleString()}</span>
                  <strong
                    className={
                      item.availability === "Available"
                        ? "availability-ok"
                        : "availability-warn"
                    }
                  >
                    {item.availability}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isCourtSport && (
          <>
            <div className="details-section">
              <div className="section-header">
                <div>
                  <span className="section-badge">Reservation Schedule</span>

                  <h2 className="details-title">Choose Time Slot</h2>
                </div>
              </div>

              <div className="booking-date-box">
                <label>Reservation Date</label>

                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {selectedDate && (
                <div className="slots-grid">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((session, index) => (
                      <button
                        key={index}
                        disabled={session.status === "Booked"}
                        className={`slot-card ${
                          selectedSlot === session.slot
                            ? "selected-slot-card"
                            : ""
                        } ${
                          session.status === "Booked" ? "booked-slot-card" : ""
                        }`}
                        onClick={() => setSelectedSlot(session.slot)}
                      >
                        <h3>{session.slot}</h3>

                        <span>{session.status}</span>
                      </button>
                    ))
                  ) : (
                    <div className="empty-slots">No available slots found.</div>
                  )}
                </div>
              )}
            </div>

            <div className="booking-selection-bar">
              <button className="continue-booking-btn" onClick={handleContinue}>
                Continue Booking
              </button>
            </div>
          </>
        )}

        {activeCoach && (
          <div className="booking-modal-overlay">
            <div className="booking-modal">
              <button className="close-modal-btn" onClick={closeCoachModal}>
                ×
              </button>

              <div className="modal-top">
                <div className="modal-image-placeholder">Coach Image</div>

                <div className="modal-details">
                  <span className="modal-badge">Professional Coach</span>

                  <h2>{activeCoach.name}</h2>

                  <p>{activeCoach.description}</p>

                  <div className="card-info-list">
                    <div className="card-info-row">
                      <span>Experience</span>

                      <strong>{activeCoach.experience}</strong>
                    </div>

                    <div className="card-info-row">
                      <span>Rating</span>

                      <strong>{activeCoach.rating}</strong>
                    </div>

                    <div className="card-info-row">
                      <span>Speciality</span>

                      <strong>{activeCoach.speciality}</strong>
                    </div>

                    {isTableTennis && (
                      <>
                        <div className="card-info-row">
                          <span>Assigned Table</span>

                          <strong>{activeCoach.assignedTable}</strong>
                        </div>

                        <div className="card-info-row">
                          <span>Session Time</span>

                          <strong>{activeCoach.assignedSession}</strong>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="modal-price">LKR {activeCoach.price}</div>
                </div>
              </div>

              <div className="booking-date-box">
                <label>Reservation Date</label>

                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {!isTableTennis && selectedDate && (
                <div className="slots-grid">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((session, index) => (
                      <button
                        key={index}
                        disabled={session.status === "Booked"}
                        className={`slot-card ${
                          selectedSlot === session.slot
                            ? "selected-slot-card"
                            : ""
                        } ${
                          session.status === "Booked" ? "booked-slot-card" : ""
                        }`}
                        onClick={() => setSelectedSlot(session.slot)}
                      >
                        <h3>{session.slot}</h3>

                        <span>{session.status}</span>
                      </button>
                    ))
                  ) : (
                    <div className="empty-slots">No available slots found.</div>
                  )}
                </div>
              )}

              <div className="modal-actions">
                <button className="cancel-modal-btn" onClick={closeCoachModal}>
                  Cancel
                </button>

                <button
                  className="confirm-modal-btn"
                  onClick={handleCoachBooking}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SportDetails;
