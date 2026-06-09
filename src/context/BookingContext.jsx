import { createContext, useContext, useMemo, useState, useEffect } from "react";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  /* =========================
     AUTH STATE
  ========================= */

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem("isLoggedIn");
    const savedUser = localStorage.getItem("user");

    if (savedAuth === "true") {
      setIsLoggedIn(true);
      if (savedUser) {
        try {
          setAuthUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Error parsing user from localStorage:", e);
        }
      }
    }
  }, []);

  const loginUser = (user) => {
    setIsLoggedIn(true);
    setAuthUser(user);

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    setAuthUser(null);

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userName");

    clearBooking();
  };

  /* =========================
     BOOKING STATES
  ========================= */

  const [selectedSport, setSelectedSport] = useState(null);

  const [selectedCourt, setSelectedCourt] = useState(null);

  const [selectedCoach, setSelectedCoach] = useState(null);

  const [selectedEquipment, setSelectedEquipment] = useState([]);

  const [bookingType, setBookingType] = useState("");

  const defaultBookingDetails = {
    bookingDate: "",

    bookingDay: "",

    bookingTime: "",

    duration: "1 Hour",

    players: 1,

    skillLevel: "",

    notes: "",
  };

  const [bookingDetails, setBookingDetails] = useState(defaultBookingDetails);

  /* =========================
     DATE UTILITIES
  ========================= */

  const getDayName = (dateString) => {
    if (!dateString) {
      return "";
    }

    return new Date(dateString)
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toLowerCase();
  };

  /* =========================
     AUTO UPDATE DAY
  ========================= */

  useEffect(() => {
    if (!bookingDetails.bookingDate) {
      return;
    }

    const dayName = getDayName(bookingDetails.bookingDate);

    setBookingDetails((prev) => ({
      ...prev,

      bookingDay: dayName,
    }));
  }, [bookingDetails.bookingDate]);

  /* =========================
     SLOT GENERATION
  ========================= */

  const availableTimeSlots = useMemo(() => {
    if (!selectedSport || !bookingDetails.bookingDate) {
      return [];
    }

    const selectedDay = getDayName(bookingDetails.bookingDate);

    const timetableForDay = selectedSport?.timetable?.[selectedDay];

    if (!timetableForDay) {
      return [];
    }

    const allSlots = [
      ...(timetableForDay.morning || []),

      ...(timetableForDay.evening || []),
    ];

    const storedBookedSlots =
      JSON.parse(localStorage.getItem("bookedSlots")) || {};

    const bookingDate = bookingDetails.bookingDate;

    let slotKey = null;

    if (selectedSport.slug === "badminton") {
      if (!selectedCourt) {
        return [];
      }

      slotKey = selectedCourt.id;
    }

    if (selectedSport.slug === "table-tennis") {
      if (!selectedCoach) {
        return [];
      }

      slotKey = selectedCoach.id;
    }

    const bookedSlots = storedBookedSlots?.[bookingDate]?.[slotKey] || [];

    return allSlots.map((slot) => ({
      slot,

      status: bookedSlots.includes(slot) ? "Booked" : "Available",
    }));
  }, [selectedSport, selectedCourt, selectedCoach, bookingDetails.bookingDate]);

  /* =========================
     EQUIPMENT
  ========================= */

  const addEquipment = (equipment) => {
    const exists = selectedEquipment.find((item) => item.id === equipment.id);

    if (!exists) {
      setSelectedEquipment((prev) => [...prev, equipment]);
    }
  };

  const removeEquipment = (id) => {
    setSelectedEquipment((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleEquipment = (equipment) => {
    const exists = selectedEquipment.find((item) => item.id === equipment.id);

    if (exists) {
      removeEquipment(equipment.id);
    } else {
      addEquipment(equipment);
    }
  };

  /* =========================
     PRICING
  ========================= */

  const courtFee =
    selectedSport?.slug === "badminton" ? selectedCourt?.pricePerHour || 0 : 0;

  const coachFee = selectedCoach?.price || 0;

  const equipmentTotal = selectedEquipment.reduce(
    (total, item) => total + item.rentalPrice,
    0,
  );

  const serviceFee = 500;

  const totalAmount = courtFee + coachFee + equipmentTotal + serviceFee;

  /* =========================
     CLEAR BOOKING
  ========================= */

  const clearBooking = () => {
    setSelectedSport(null);

    setSelectedCourt(null);

    setSelectedCoach(null);

    setSelectedEquipment([]);

    setBookingType("");

    setBookingDetails(defaultBookingDetails);
  };

  /* =========================
     CONTEXT VALUE
  ========================= */

  const value = {
    isLoggedIn,

    setIsLoggedIn,

    authUser,

    setAuthUser,

    loginUser,

    logoutUser,

    selectedSport,

    setSelectedSport,

    selectedCourt,

    setSelectedCourt,

    selectedCoach,

    setSelectedCoach,

    selectedEquipment,

    setSelectedEquipment,

    bookingType,

    setBookingType,

    bookingDetails,

    setBookingDetails,

    availableTimeSlots,

    addEquipment,

    removeEquipment,

    toggleEquipment,

    courtFee,

    coachFee,

    equipmentTotal,

    serviceFee,

    totalAmount,

    clearBooking,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }

  return context;
}
