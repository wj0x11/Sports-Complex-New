import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { getDb } from "../../../src/services/api/mockDb";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  /* =========================
     AUTH STATE
  ========================= */

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("authSession") || "null");
    if (session?.token && session?.user) {
      setIsLoggedIn(true);
      setAuthUser(session.user);
      setAuthToken(session.token);
    }
  }, []);

  const loginUser = (sessionData = {}) => {
    setIsLoggedIn(true);
    if (sessionData.user) setAuthUser(sessionData.user);
    if (sessionData.token) setAuthToken(sessionData.token);
    localStorage.setItem(
      "authSession",
      JSON.stringify({
        token: sessionData.token || authToken || "jwt-placeholder",
        user: sessionData.user || authUser,
      }),
    );
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    setAuthUser(null);
    setAuthToken("");
    localStorage.removeItem("authSession");

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

    const existingBookings = getDb().bookings || [];
    const bookedSlots = existingBookings
      .filter(
        (booking) =>
          booking.bookingDetails?.bookingDate === bookingDate &&
          (booking.court?.id === slotKey || booking.coach?.id === slotKey),
      )
      .map((booking) => booking.bookingDetails?.bookingTime)
      .filter(Boolean);

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
    authUser,
    authToken,

    setIsLoggedIn,

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
