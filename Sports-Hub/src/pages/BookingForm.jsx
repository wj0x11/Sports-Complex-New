import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { CalendarDays, Clock3, Trophy, Users, ShieldCheck } from "lucide-react";

import { useBooking } from "../context/BookingContext";

import "../styles/bookingForm.css";

function BookingForm() {
  const navigate = useNavigate();

  const {
    selectedSport,
    selectedCourt,
    selectedCoach,
    selectedSession,
    bookingDetails,
    setBookingDetails,
    isLoggedIn,
  } = useBooking();

  const [bookingDate, setBookingDate] = useState(
    bookingDetails.bookingDate || "",
  );

  const [duration, setDuration] = useState(bookingDetails.duration || "1 Hour");

  const [players, setPlayers] = useState(bookingDetails.players || 1);

  const [error, setError] = useState("");

  const durationHours = parseInt(duration.split(" ")[0]) || 1;

  const courtFee = (selectedCourt?.pricePerHour || 0) * durationHours;

  const coachFee = selectedCoach?.price || 0;

  const serviceFee = Math.round((courtFee + coachFee) * 0.05);

  const estimatedTotal = courtFee + coachFee + serviceFee;

  const formattedDay = useMemo(() => {
    if (!bookingDate) return "";

    return new Date(bookingDate).toLocaleDateString("en-US", {
      weekday: "long",
    });
  }, [bookingDate]);

  const handleContinue = (e) => {
    e.preventDefault();

    setError("");

    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: {
            pathname: "/booking-form",
          },
        },
      });

      return;
    }

    if (!bookingDate) {
      setError("Please select reservation date.");

      return;
    }

    if (players < 1) {
      setError("Players count must be at least 1.");

      return;
    }

    setBookingDetails({
      ...bookingDetails,

      bookingDate,

      bookingDay: formattedDay,

      duration,

      players: Number(players),

      totalAmount: estimatedTotal,
    });

    navigate("/booking");
  };

  return (
    <div className="booking-form-page">
      <div className="container">
        <div className="booking-progress">
          <div className="progress-step active-step">Sport</div>

          <div className="progress-line"></div>

          <div className="progress-step active-step">Reservation</div>

          <div className="progress-line"></div>

          <div className="progress-step">Review</div>

          <div className="progress-line"></div>

          <div className="progress-step">Payment</div>
        </div>

        <div className="compact-layout">
          <div className="booking-form-container">
            <div className="booking-header">
              <span className="booking-badge">Smart Reservation</span>

              <h1 className="booking-form-title">Complete Your Booking</h1>

              <p className="booking-form-subtitle">
                Finalize your reservation details before confirming your
                booking.
              </p>
            </div>

            <div className="quick-info-strip">
              <div>
                <ShieldCheck size={15} />
                Instant Confirmation
              </div>

              <div>
                <ShieldCheck size={15} />
                Verified Coaches
              </div>

              <div>
                <ShieldCheck size={15} />
                Secure Reservation
              </div>
            </div>

            <div className="booking-selected-info">
              <div className="selected-info-card">
                <span>Sport</span>

                <strong>{selectedSport?.name || "Selected Sport"}</strong>
              </div>

              {selectedCourt && (
                <div className="selected-info-card">
                  <span>Court</span>

                  <strong>{selectedCourt.name}</strong>
                </div>
              )}

              {selectedCoach && (
                <div className="selected-info-card">
                  <span>Coach</span>

                  <strong>{selectedCoach.name}</strong>
                </div>
              )}
            </div>

            <div className="selected-session-preview">
              <div className="session-preview-top">
                <span>Selected Session</span>

                <strong>{selectedSession?.slot || "Session Reserved"}</strong>
              </div>

              <p>
                Your reservation slot has been selected from the previous step.
              </p>
            </div>

            <form className="booking-form" onSubmit={handleContinue}>
              <div className="booking-form-group">
                <label>Reservation Date</label>

                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              <div className="booking-form-group">
                <label>Duration</label>

                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="1 Hour">1 Hour</option>

                  <option value="2 Hours">2 Hours</option>

                  <option value="3 Hours">3 Hours</option>
                </select>
              </div>

              <div className="booking-form-group full-width">
                <label>Number Of Players</label>

                <input
                  type="number"
                  min="1"
                  value={players}
                  onChange={(e) => setPlayers(e.target.value)}
                />
              </div>

              {error && <div className="booking-error">{error}</div>}

              <button className="booking-form-btn">Continue To Review</button>
            </form>
          </div>

          <div className="booking-summary-panel">
            <div className="compact-summary-card">
              <span className="summary-badge">Reservation Summary</span>

              <h2 className="summary-title">Booking Overview</h2>

              <div className="summary-list">
                <div className="summary-row">
                  <span>
                    <Trophy size={14} />
                    Sport
                  </span>

                  <strong>{selectedSport?.name || "Selected Sport"}</strong>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row">
                  <span>
                    <Clock3 size={14} />
                    Session
                  </span>

                  <strong>{selectedSession?.slot || "Reserved"}</strong>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row">
                  <span>
                    <Users size={14} />
                    Players
                  </span>

                  <strong>{players}</strong>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row">
                  <span>
                    <CalendarDays size={14} />
                    Duration
                  </span>

                  <strong>{duration}</strong>
                </div>
              </div>

              <div className="pricing-divider"></div>

              <div className="summary-pricing">
                <div className="pricing-row">
                  <span>Court Fee</span>

                  <strong>LKR {courtFee.toLocaleString()}</strong>
                </div>

                <div className="pricing-row">
                  <span>Coach Fee</span>

                  <strong>LKR {coachFee.toLocaleString()}</strong>
                </div>

                <div className="pricing-row">
                  <span>Service Fee</span>

                  <strong>LKR {serviceFee.toLocaleString()}</strong>
                </div>
              </div>

              <div className="summary-total-box">
                <span>Total Amount</span>

                <h1>LKR {estimatedTotal.toLocaleString()}</h1>
              </div>

              <div className="summary-footer">
                Reservation slots remain temporarily secured until final
                confirmation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
