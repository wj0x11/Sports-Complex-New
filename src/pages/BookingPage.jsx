import { Link, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import {
  CalendarDays,
  Clock3,
  Trophy,
  Users,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { useBooking } from "../context/BookingContext";

import "../styles/booking.css";

function BookingPage() {
  const navigate = useNavigate();

  const {
    selectedSport,
    selectedCourt,
    selectedCoach,
    selectedEquipment,
    bookingDetails,
    isLoggedIn,
  } = useBooking();

  useEffect(() => {
    if (!selectedSport) {
      navigate("/");
    }
  }, [selectedSport, navigate]);

  const [bookingId] = useState(() => 
    "BBSC-" + Math.floor(100000 + Math.random() * 900000)
  );

  const courtFee = bookingDetails?.courtFee || 0;

  const coachFee = bookingDetails?.coachFee || 0;

  const equipmentTotal = bookingDetails?.equipmentTotal || 0;

  const serviceFee = bookingDetails?.serviceFee || 0;

  const finalTotal = bookingDetails?.totalAmount || 0;

  const bookingType = selectedCoach
    ? "Coaching Reservation"
    : "Court Reservation";

  const handleProceedToPayment = () => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: {
            pathname: "/payment",
          },
        },
      });

      return;
    }

    navigate("/payment");
  };

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-review-layout">
          <div className="booking-main-content">
            <div className="booking-header">
              <span className="booking-badge">Reservation Review</span>

              <h1 className="booking-title">Review Your Booking</h1>

              <p className="booking-subtitle">
                Verify your selected schedule, facilities, coaching sessions,
                and pricing details before payment confirmation.
              </p>
            </div>

            <div className="reservation-status-card">
              <div className="status-content">
                <div className="status-icon">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <span>Reservation Status</span>

                  <h3>Awaiting Payment</h3>

                  <p>Your selected slot is temporarily secured.</p>
                </div>
              </div>

              <div className="reservation-id-box">
                <small>Reservation ID</small>

                <strong>{bookingId}</strong>
              </div>
            </div>

            <div className="booking-card-grid">
              <div className="booking-card">
                <div className="booking-card-top">
                  <Trophy size={16} />

                  <span>Sport Information</span>
                </div>

                <div className="booking-card-content">
                  <div className="booking-row">
                    <span>Selected Sport</span>

                    <strong>{selectedSport?.name}</strong>
                  </div>

                  <div className="booking-row">
                    <span>Booking Type</span>

                    <strong>{bookingType}</strong>
                  </div>
                </div>
              </div>

              {selectedCourt && (
                <div className="booking-card">
                  <div className="booking-card-top">
                    <Users size={16} />

                    <span>Court Reservation</span>
                  </div>

                  <div className="booking-card-content">
                    <div className="booking-row">
                      <span>Court</span>

                      <strong>{selectedCourt.name}</strong>
                    </div>

                    <div className="booking-row">
                      <span>Capacity</span>

                      <strong>{selectedCourt.capacity}</strong>
                    </div>

                    <div className="booking-row">
                      <span>Court Fee</span>

                      <strong>LKR {courtFee.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              )}

              {selectedCoach && (
                <div className="booking-card">
                  <div className="booking-card-top">
                    <ShieldCheck size={16} />

                    <span>Coaching Session</span>
                  </div>

                  <div className="booking-card-content">
                    <div className="booking-row">
                      <span>Coach</span>

                      <strong>{selectedCoach.name}</strong>
                    </div>

                    <div className="booking-row">
                      <span>Experience</span>

                      <strong>{selectedCoach.experience}</strong>
                    </div>

                    <div className="booking-row">
                      <span>Coaching Fee</span>

                      <strong>LKR {coachFee.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="booking-card">
                <div className="booking-card-top">
                  <CalendarDays size={16} />

                  <span>Reservation Schedule</span>
                </div>

                <div className="booking-card-content">
                  <div className="booking-row">
                    <span>Date</span>

                    <strong>{bookingDetails?.bookingDate}</strong>
                  </div>

                  <div className="booking-row">
                    <span>Day</span>

                    <strong>{bookingDetails?.bookingDay}</strong>
                  </div>

                  <div className="booking-row">
                    <span>Duration</span>

                    <strong>{bookingDetails?.duration}</strong>
                  </div>

                  <div className="booking-row">
                    <span>Players</span>

                    <strong>{bookingDetails?.players}</strong>
                  </div>
                </div>
              </div>

              {selectedEquipment?.length > 0 && (
                <div className="booking-card full-card">
                  <div className="booking-card-top">
                    <Clock3 size={16} />

                    <span>Rental Equipment</span>
                  </div>

                  <div className="equipment-list">
                    {selectedEquipment.map((item) => (
                      <div className="equipment-item" key={item.id}>
                        <div>
                          <h4>{item.name}</h4>

                          <p>Equipment Rental</p>
                        </div>

                        <strong>LKR {item.rentalPrice.toLocaleString()}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="booking-sidebar">
            <div className="pricing-card">
              <span className="pricing-badge">Payment Summary</span>

              <h2>Reservation Total</h2>

              <div className="pricing-list">
                <div className="pricing-row">
                  <span>Court Fee</span>

                  <strong>LKR {courtFee.toLocaleString()}</strong>
                </div>

                <div className="pricing-row">
                  <span>Coaching Fee</span>

                  <strong>LKR {coachFee.toLocaleString()}</strong>
                </div>

                <div className="pricing-row">
                  <span>Equipment Rental</span>

                  <strong>LKR {equipmentTotal.toLocaleString()}</strong>
                </div>

                <div className="pricing-row">
                  <span>Service Charge</span>

                  <strong>LKR {serviceFee.toLocaleString()}</strong>
                </div>
              </div>

              <div className="pricing-total">
                <span>Total Payment</span>

                <h1>LKR {finalTotal.toLocaleString()}</h1>
              </div>

              <div className="pricing-note">
                Reservations become fully confirmed after successful payment
                verification.
              </div>

              <div className="booking-actions">
                <button
                  className="confirm-btn"
                  onClick={handleProceedToPayment}
                >
                  <Wallet size={15} />
                  Proceed To Payment
                </button>

                <Link to="/">
                  <button className="cancel-btn">Cancel Reservation</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
