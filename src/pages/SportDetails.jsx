import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSportBySlug } from "../services/sports.service";
import { useBooking } from "../context/BookingContext";
import { apiClient } from "../services/api/client";
import "../styles/sportDetails.css";

function SportDetails() {
  const { sportSlug } = useParams();
  const navigate = useNavigate();

  const {
    selectedCourt,
    setSelectedCourt,
    setSelectedCoach,
    setSelectedSport,
    selectedEquipment,
    toggleEquipment,
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
  const [bookedSlots, setBookedSlots] = useState([]);

  const sport = getSportBySlug(sportSlug);
  const isCoachSport = sport?.type === "coach";
  const hasCourts = sport?.type === "court" && Boolean(sport?.courts?.length);
  const showTimetable = sport?.hasTimetable === true;

  const getDayName = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
  };

  useEffect(() => {
    if (!sport || !selectedDate) {
      setBookedSlots([]);
      return;
    }
    const facilityId = activeCoach ? activeCoach.id : selectedCourt?.id;
    if (!facilityId) {
      setBookedSlots([]);
      return;
    }
    apiClient.getBookedSlots(sport.slug, selectedDate, facilityId)
      .then((slots) => {
        setBookedSlots(slots);
      })
      .catch((err) => {
        console.error("Error fetching booked slots from database:", err);
      });
  }, [sport, selectedDate, selectedCourt, activeCoach]);

  const availableSlots = useMemo(() => {
    if (!sport || !selectedDate || isCoachSport) return [];

    const selectedDay = getDayName(selectedDate);
    const timetable = sport.timetable?.[selectedDay];
    if (!timetable) return [];

    const allSlots = [...timetable.morning, ...timetable.evening];
    if (!selectedCourt) return [];

    return allSlots.map((slot) => ({
      slot,
      status: bookedSlots.includes(slot) ? "Booked" : "Available",
    }));
  }, [selectedDate, selectedCourt, sport, isCoachSport, bookedSlots]);


  if (!sport) {
    return (
      <div className="sport-details-page">
        <div className="container sport-not-found">
          <h1>Sport Not Found</h1>
          <p>The sport you are looking for does not exist.</p>
          <Link to="/sports" className="action-btn">
            Browse All Sports
          </Link>
        </div>
      </div>
    );
  }

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
      alert("Please select a reservation date.");
      return;
    }

    if (isCoachSport) {
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
        alert("Please select a time slot.");
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
      alert(`Please select a ${sport.name.toLowerCase()} facility.`);
      return;
    }
    if (!selectedDate) {
      alert("Please select a reservation date.");
      return;
    }
    if (!selectedSlot) {
      alert("Please select an available time slot.");
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
        <div
          className="sport-hero sport-hero-image"
          style={{ backgroundImage: `url(${sport.image})` }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content-wrapper">
            <span className="hero-sport-type">{sport.category}</span>
            <h1 className="sport-hero-title">{sport.name}</h1>
            <p className="sport-hero-text">{sport.description}</p>
          </div>
        </div>

        {sport.bookingInfo && (
          <div className="details-section booking-info-section">
            <div className="section-header">
              <div>
                <span className="section-badge">How It Works</span>
                <h2 className="details-title">Booking Information</h2>
              </div>
            </div>
            <div className="booking-info-card">
              <p>{sport.bookingInfo}</p>
            </div>
          </div>
        )}

        {showTimetable && !isCoachSport && (
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

        {hasCourts && !isCoachSport && (
          <div className="details-section">
            <div className="section-header">
              <div>
                <span className="section-badge">{sport.name} Facilities</span>
                <h2 className="details-title">Select Facility</h2>
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
                  <div className="card-premium-badge">Available</div>
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
                      : "Select Facility"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {sport.coaches?.length > 0 && (
          <div className="details-section">
            <div className="section-header">
              <div>
                <span className="section-badge">Professional Coaches</span>
                <h2 className="details-title">
                  {isCoachSport ? "Select Coach Session" : "Optional Coaching"}
                </h2>
              </div>
            </div>

            <div className="details-grid">
              {sport.coaches.map((coach) => (
                <div className="details-card coach-card" key={coach.id}>
                  <div className="card-premium-glow"></div>
                  {coach.photo ? (
                    <img
                      src={coach.photo}
                      alt={coach.name}
                      className="coach-card-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="card-image-placeholder">Coach Image</div>
                  )}
                  <div className="card-premium-badge">Certified Coach</div>
                  <h3 className="card-title">{coach.name}</h3>
                  {coach.position && (
                    <p className="coach-position">{coach.position}</p>
                  )}
                  <div className="card-info-list">
                    <div className="card-info-row">
                      <span>Experience</span>
                      <strong>{coach.experience}</strong>
                    </div>
                    <div className="card-info-row">
                      <span>Specialization</span>
                      <strong>{coach.speciality}</strong>
                    </div>
                    <div className="card-info-row">
                      <span>Session Fee</span>
                      <strong>LKR {coach.price}</strong>
                    </div>
                    {isCoachSport && (
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
                  {coach.description && (
                    <p className="coach-bio">{coach.description}</p>
                  )}
                  <button
                    className="action-btn"
                    onClick={() => openCoachModal(coach)}
                  >
                    {isCoachSport ? "Reserve Session" : "View Coach"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {sport.equipment?.length > 0 && (
          <div className="details-section">
            <div className="section-header">
              <div>
                <span className="section-badge">Gear Rental</span>
                <h2 className="details-title">Equipment Rentals</h2>
              </div>
            </div>

            <div className="details-grid equipment-grid">
              {sport.equipment.map((item) => {
                const isSelected = selectedEquipment.some(
                  (eq) => eq.id === item.id,
                );
                return (
                  <div
                    className={`details-card equipment-card ${
                      isSelected ? "selected-card" : ""
                    }`}
                    key={item.id}
                  >
                    <div className="card-premium-badge">Basic Equipment</div>
                    <h3 className="card-title">{item.name}</h3>
                    <div className="card-info-row">
                      <span>Rental Price</span>
                      <strong>LKR {item.rentalPrice}</strong>
                    </div>
                    <button
                      className="action-btn"
                      onClick={() => toggleEquipment(item)}
                    >
                      {isSelected ? "Remove" : "Add to Booking"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {hasCourts && !isCoachSport && (
          <>
            <div className="details-section">
              <div className="section-header">
                <div>
                  <span className="section-badge">Reservation Schedule</span>
                  <h2 className="details-title">Choose Time Slot</h2>
                </div>
              </div>

              <div className="booking-date-box">
                <label htmlFor="reservation-date">Reservation Date</label>
                <input
                  id="reservation-date"
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
                    <div className="empty-slots">
                      {selectedCourt
                        ? "No available slots found."
                        : "Please select a facility first."}
                    </div>
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
          <div className="booking-modal-overlay" onClick={closeCoachModal}>
            <div
              className="booking-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-modal-btn" onClick={closeCoachModal}>
                ×
              </button>

              <div className="modal-top">
                {activeCoach.photo ? (
                  <img
                    src={activeCoach.photo}
                    alt={activeCoach.name}
                    className="modal-coach-image"
                  />
                ) : (
                  <div className="modal-image-placeholder">Coach Image</div>
                )}

                <div className="modal-details">
                  <span className="modal-badge">Professional Coach</span>
                  <h2>{activeCoach.name}</h2>
                  {activeCoach.position && (
                    <p className="coach-position">{activeCoach.position}</p>
                  )}
                  <p>{activeCoach.description}</p>

                  <div className="card-info-list">
                    <div className="card-info-row">
                      <span>Experience</span>
                      <strong>{activeCoach.experience}</strong>
                    </div>
                    <div className="card-info-row">
                      <span>Specialization</span>
                      <strong>{activeCoach.speciality}</strong>
                    </div>
                    {isCoachSport && (
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
                <label htmlFor="coach-reservation-date">Reservation Date</label>
                <input
                  id="coach-reservation-date"
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {!isCoachSport && selectedDate && (
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
