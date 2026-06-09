import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useBooking } from "../context/BookingContext";

import "../styles/payment.css";

function PaymentPage() {
  const navigate = useNavigate();

  const {
    selectedSport,
    selectedCourt,
    selectedCoach,
    selectedEquipment,
    bookingType,
    bookingDetails,
    clearBooking,
    courtFee,
    coachFee,
    equipmentTotal,
    serviceFee,
    totalAmount,
  } = useBooking();

  const [selectedMethod, setSelectedMethod] = useState("card");

  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (!selectedSport || !bookingDetails?.bookingTime) {
      navigate("/");
    }
  }, [selectedSport, bookingDetails, navigate]);

  const handlePayment = () => {
    setProcessingPayment(true);

    const existingBookings =
      JSON.parse(localStorage.getItem("sportsBookings")) || [];

    const currentUser = JSON.parse(localStorage.getItem("user")) || null;

    const reservationId = "BBSC-" + Math.floor(100000 + Math.random() * 900000);

    const newBooking = {
      id: Date.now(),

      reservationId,

      user: currentUser,

      sport: selectedSport,

      court: selectedCourt,

      coach: selectedCoach,

      equipment: selectedEquipment,

      bookingType,

      bookingDetails,

      totalAmount,

      courtFee,

      coachFee,

      equipmentTotal,

      serviceFee,

      paymentMethod: selectedMethod,

      paymentStatus: "Paid",

      status: "Confirmed",

      createdAt: new Date().toISOString(),
    };

    const existingSlotData =
      JSON.parse(localStorage.getItem("bookedSlots")) || {};

    const bookingDate = bookingDetails.bookingDate;

    const slotOwnerId =
      selectedSport?.slug === "badminton"
        ? selectedCourt?.id
        : selectedCoach?.id;

    if (!existingSlotData[bookingDate]) {
      existingSlotData[bookingDate] = {};
    }

    if (!existingSlotData[bookingDate][slotOwnerId]) {
      existingSlotData[bookingDate][slotOwnerId] = [];
    }

    if (
      !existingSlotData[bookingDate][slotOwnerId].includes(
        bookingDetails.bookingTime,
      )
    ) {
      existingSlotData[bookingDate][slotOwnerId].push(
        bookingDetails.bookingTime,
      );
    }

    localStorage.setItem("bookedSlots", JSON.stringify(existingSlotData));

    const updatedBookings = [...existingBookings, newBooking];

    localStorage.setItem("sportsBookings", JSON.stringify(updatedBookings));

    setTimeout(() => {
      setProcessingPayment(false);

      navigate("/booking-success", {
        state: {
          booking: newBooking,
        },
      });

      clearBooking();
    }, 1500);
  };

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-layout">
          <div className="payment-left">
            <div className="payment-header">
              <span className="payment-badge">Secure Checkout</span>

              <h1 className="payment-title">Complete Payment</h1>

              <p className="payment-subtitle">
                Confirm your reservation and securely complete payment for your
                sports session.
              </p>
            </div>

            <div className="payment-methods-card">
              <div className="card-glow"></div>

              <div className="payment-card-header">
                <div>
                  <h2>Choose Payment Method</h2>

                  <p>All transactions are securely encrypted and protected.</p>
                </div>

                <div className="secure-badge">SSL Secured</div>
              </div>

              <div className="payment-methods-grid">
                <div
                  className={`payment-method-card ${
                    selectedMethod === "card" ? "active-payment-method" : ""
                  }`}
                  onClick={() => setSelectedMethod("card")}
                >
                  <h3>Bank Card</h3>

                  <p>Visa, Mastercard & debit cards</p>
                </div>

                <div
                  className={`payment-method-card ${
                    selectedMethod === "ezcash" ? "active-payment-method" : ""
                  }`}
                  onClick={() => setSelectedMethod("ezcash")}
                >
                  <h3>eZ Cash</h3>

                  <p>Sri Lankan mobile wallet payments</p>
                </div>

                <div
                  className={`payment-method-card ${
                    selectedMethod === "frimi" ? "active-payment-method" : ""
                  }`}
                  onClick={() => setSelectedMethod("frimi")}
                >
                  <h3>Frimi</h3>

                  <p>Digital banking & QR payments</p>
                </div>

                <div
                  className={`payment-method-card ${
                    selectedMethod === "bank" ? "active-payment-method" : ""
                  }`}
                  onClick={() => setSelectedMethod("bank")}
                >
                  <h3>Bank Transfer</h3>

                  <p>Online banking transfer service</p>
                </div>
              </div>

              <div className="payment-form-card">
                <h2 className="form-title">Payment Details</h2>

                <div className="payment-form">
                  <div className="payment-input-group">
                    <label>Card Holder Name</label>

                    <input type="text" placeholder="Enter card holder name" />
                  </div>

                  <div className="payment-input-group">
                    <label>Card Number</label>

                    <input type="text" placeholder="XXXX XXXX XXXX XXXX" />
                  </div>

                  <div className="payment-row">
                    <div className="payment-input-group">
                      <label>Expiry Date</label>

                      <input type="text" placeholder="MM / YY" />
                    </div>

                    <div className="payment-input-group">
                      <label>CVV</label>

                      <input type="password" placeholder="***" />
                    </div>
                  </div>
                </div>

                <div className="payment-security-info">
                  <div className="security-item">
                    Secure encrypted payment gateway
                  </div>

                  <div className="security-item">
                    Reservation protected until payment confirmation
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="payment-right">
            <div className="payment-summary-card">
              <div className="summary-header">
                <span className="summary-badge">Reservation Summary</span>

                <h2>Booking Overview</h2>
              </div>

              {selectedSport && (
                <div className="summary-row">
                  <span>Sport</span>

                  <strong>{selectedSport.name}</strong>
                </div>
              )}

              {selectedSport?.slug === "badminton" && selectedCourt && (
                <div className="summary-row">
                  <span>Court</span>

                  <strong>{selectedCourt.name}</strong>
                </div>
              )}

              {selectedCoach && (
                <div className="summary-row">
                  <span>Coach</span>

                  <strong>{selectedCoach.name}</strong>
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Reservation Date</span>

                <strong>{bookingDetails.bookingDate}</strong>
              </div>

              <div className="summary-row">
                <span>Timetable Day</span>

                <strong>{bookingDetails.bookingDay}</strong>
              </div>

              <div className="summary-row">
                <span>Session Slot</span>

                <strong>{bookingDetails.bookingTime}</strong>
              </div>

              <div className="summary-row">
                <span>Duration</span>

                <strong>{bookingDetails.duration}</strong>
              </div>

              <div className="summary-row">
                <span>Players</span>

                <strong>{bookingDetails.players}</strong>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Facility Fee</span>

                <strong>LKR {courtFee.toLocaleString()}</strong>
              </div>

              <div className="summary-row">
                <span>Coaching Fee</span>

                <strong>LKR {coachFee.toLocaleString()}</strong>
              </div>

              {selectedEquipment?.length > 0 && (
                <>
                  <div className="equipment-title">Equipment Rental</div>

                  {selectedEquipment.map((item) => (
                    <div className="summary-row" key={item.id}>
                      <span>{item.name}</span>

                      <strong>LKR {item.rentalPrice.toLocaleString()}</strong>
                    </div>
                  ))}

                  <div className="summary-row">
                    <span>Equipment Total</span>

                    <strong>LKR {equipmentTotal.toLocaleString()}</strong>
                  </div>
                </>
              )}

              <div className="summary-row">
                <span>Service Charge</span>

                <strong>LKR {serviceFee.toLocaleString()}</strong>
              </div>

              <div className="summary-total">
                <span>Total Payment</span>

                <h1>LKR {totalAmount.toLocaleString()}</h1>
              </div>

              <div className="payment-note">
                Your reservation will be instantly confirmed after successful
                payment verification.
              </div>

              <div className="payment-actions">
                <button
                  className="pay-btn"
                  onClick={handlePayment}
                  disabled={processingPayment}
                >
                  {processingPayment
                    ? "Processing Payment..."
                    : "Confirm Payment"}
                </button>

                <button
                  className="cancel-payment-btn"
                  onClick={() => {
                    navigate("/booking");
                  }}
                >
                  Modify Reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
