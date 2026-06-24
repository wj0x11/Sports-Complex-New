import { Link, useLocation, useNavigate } from "react-router-dom";

import { useEffect } from "react";

import "../styles/bookingSuccess.css";

function BookingSuccess() {
  const location = useLocation();

  const navigate = useNavigate();

  const booking = location.state?.booking;

  useEffect(() => {
    if (!booking) {
      navigate("/");
    }
  }, [booking, navigate]);

  if (!booking) {
    return null;
  }

  const {
    reservationId,
    sport,
    court,
    coach,
    equipment,
    bookingDetails,
    totalAmount,
    paymentMethod,
    paymentStatus,
    status,
    courtFee,
    coachFee,
    equipmentTotal,
    serviceFee,
    createdAt,
  } = booking;

  const handleDownloadReceipt = () => {
    const receiptContent = `
Battle Blast Sports Complex
Reservation Receipt

Reservation ID: ${reservationId}

Sport: ${sport?.name || "N/A"}
Court: ${court?.name || "N/A"}
Coach: ${coach?.name || "N/A"}

Booking Date: ${bookingDetails?.bookingDate || "N/A"}
Booking Time: ${bookingDetails?.bookingTime || "N/A"}
Duration: ${bookingDetails?.duration || "N/A"}
Players: ${bookingDetails?.players || "N/A"}

Facility Fee: LKR ${courtFee?.toLocaleString() || 0}
Coaching Fee: LKR ${coachFee?.toLocaleString() || 0}
Equipment Total: LKR ${equipmentTotal?.toLocaleString() || 0}
Service Fee: LKR ${serviceFee?.toLocaleString() || 0}

Total Paid: LKR ${totalAmount?.toLocaleString() || 0}

Payment Method: ${paymentMethod}
Payment Status: ${paymentStatus}
Reservation Status: ${status}

Generated On:
${new Date(createdAt).toLocaleString()}

Thank you for choosing Battle Blast Sports Complex.
`;

    const blob = new Blob([receiptContent], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${reservationId}-receipt.txt`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="success-page">
      <div className="container">
        <div className="success-container">
          <div className="success-top-card">
            <div className="success-icon">✓</div>

            <span className="success-badge">Reservation Confirmed</span>

            <h1 className="success-title">Booking Successfully Confirmed</h1>

            <p className="success-text">
              Your sports reservation has been successfully processed and
              confirmed. The selected facility and session schedule are now
              reserved under your booking profile.
            </p>
          </div>

          <div className="success-layout">
            <div className="success-left-card">
              <div className="summary-top">
                <span className="summary-badge">Reservation Receipt</span>

                <h2>Booking Details</h2>
              </div>

              <div className="success-details">
                <div className="success-row">
                  <span>Reservation ID</span>

                  <strong>{reservationId}</strong>
                </div>

                <div className="success-row">
                  <span>Reservation Status</span>

                  <strong>{status}</strong>
                </div>

                <div className="success-row">
                  <span>Payment Status</span>

                  <strong>{paymentStatus}</strong>
                </div>

                <div className="success-row">
                  <span>Sport</span>

                  <strong>{sport?.name}</strong>
                </div>

                {sport?.slug === "badminton" && court && (
                  <div className="success-row">
                    <span>Court</span>

                    <strong>{court.name}</strong>
                  </div>
                )}

                {coach && (
                  <div className="success-row">
                    <span>Coach</span>

                    <strong>{coach.name}</strong>
                  </div>
                )}

                <div className="success-row">
                  <span>Reservation Date</span>

                  <strong>{bookingDetails?.bookingDate}</strong>
                </div>

                <div className="success-row">
                  <span>Session Slot</span>

                  <strong>{bookingDetails?.bookingTime}</strong>
                </div>

                <div className="success-row">
                  <span>Duration</span>

                  <strong>{bookingDetails?.duration}</strong>
                </div>

                <div className="success-row">
                  <span>Players</span>

                  <strong>{bookingDetails?.players}</strong>
                </div>

                <div className="success-row">
                  <span>Payment Method</span>

                  <strong>{paymentMethod}</strong>
                </div>

                <div className="success-row">
                  <span>Facility Fee</span>

                  <strong>LKR {courtFee?.toLocaleString()}</strong>
                </div>

                <div className="success-row">
                  <span>Coaching Fee</span>

                  <strong>LKR {coachFee?.toLocaleString()}</strong>
                </div>

                {equipment?.length > 0 && (
                  <>
                    {equipment.map((item) => (
                      <div className="success-row" key={item.id}>
                        <span>{item.name}</span>

                        <strong>LKR {item.rentalPrice.toLocaleString()}</strong>
                      </div>
                    ))}

                    <div className="success-row">
                      <span>Equipment Total</span>

                      <strong>LKR {equipmentTotal?.toLocaleString()}</strong>
                    </div>
                  </>
                )}

                <div className="success-row">
                  <span>Service Charge</span>

                  <strong>LKR {serviceFee?.toLocaleString()}</strong>
                </div>
              </div>

              <div className="success-total">
                <span>Total Paid</span>

                <h1>LKR {totalAmount?.toLocaleString()}</h1>
              </div>
            </div>

            <div className="success-right-card">
              <div className="premium-box">
                <span className="premium-badge">
                  Battle Blast Sports Complex
                </span>

                <h2>Reservation Successfully Processed</h2>

                <p>
                  Your booking has been added to the live reservation system and
                  is now visible in your dashboard profile.
                </p>

                <div className="premium-features">
                  <div className="premium-item">
                    Live booking confirmation enabled
                  </div>

                  <div className="premium-item">
                    Dashboard reservation tracking active
                  </div>

                  <div className="premium-item">
                    Coaching & facility allocation completed
                  </div>
                </div>
              </div>

              <div className="success-buttons">
                <button
                  className="primary-success-btn"
                  onClick={handleDownloadReceipt}
                >
                  Download Receipt
                </button>

                <Link to="/dashboard">
                  <button className="primary-success-btn">
                    View Dashboard
                  </button>
                </Link>

                <Link to="/booking-form">
                  <button className="secondary-success-btn">
                    Book Another Session
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;
