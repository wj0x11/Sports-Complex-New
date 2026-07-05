import { useState } from "react";
import "../styles/faq.css";

function FAQ() {
  // කුමන ප්‍රශ්නයද විවෘතව පවතින්නේ කියා බලාගැනීමට (State)
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    // දැනට විවෘත එකම ආයෙත් Click කරොත් වහන්න (null කරන්න), නැත්නම් අලුත් එක විවෘත කරන්න
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How can I book a sports court?",
      answer:
        "Select your preferred sport, choose an available court, complete the booking form, and proceed with payment.",
    },
    {
      question: "Can I cancel a booking?",
      answer:
        "Yes. Users can cancel bookings before the reserved session time through the booking history page.",
    },
    {
      question: "What payment methods are supported?",
      answer:
        "We support card payments, bank transfers, cash payments, eZ Cash, and mCash.",
    },
    {
      question: "Can I hire a personal coach?",
      answer:
        "Yes. Users can browse available coaches, view ratings and experience, and book coaching sessions directly.",
    },
  ];

  return (
    <div className="faq-page">
      <div className="container">
        <div className="faq-header">
          <h1 className="faq-title">Frequently Asked Questions</h1>
          <p className="faq-subtitle">
            Find answers to common questions about sports bookings, payments,
            coaching, and facility usage.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              className={`faq-card ${activeIndex === index ? "active" : ""}`} 
              key={index}
            >
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <h2>{faq.question}</h2>
                <span className="faq-icon">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>
              
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;
