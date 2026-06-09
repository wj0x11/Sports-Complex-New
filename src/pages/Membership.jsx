import "../styles/membership.css";

function Membership() {
  const plans = [
    {
      name: "Basic",

      price: "LKR 5,000",

      features: ["Court Booking Access", "Equipment Rentals", "Basic Support"],
    },

    {
      name: "Premium",

      price: "LKR 12,000",

      features: ["Priority Bookings", "Coach Sessions", "Tournament Access"],
    },

    {
      name: "Elite",

      price: "LKR 20,000",

      features: ["Unlimited Bookings", "VIP Coaching", "Exclusive Events"],
    },
  ];

  return (
    <div className="membership-page">
      <div className="container">
        <div className="membership-header">
          <h1 className="membership-title">Membership Plans</h1>

          <p className="membership-subtitle">
            Choose the best sports membership package for your training and
            booking experience.
          </p>
        </div>

        <div className="membership-grid">
          {plans.map((plan, index) => (
            <div className="membership-card" key={index}>
              <h2 className="membership-plan">{plan.name}</h2>

              <h1 className="membership-price">{plan.price}</h1>

              <div className="membership-features">
                {plan.features.map((feature, i) => (
                  <p key={i}>✓ {feature}</p>
                ))}
              </div>

              <button className="membership-btn">Choose Plan</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Membership;
