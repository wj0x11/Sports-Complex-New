const nowIso = () => new Date().toISOString();

export const seedData = {
  users: [],
  sports: [
    {
      id: "sport-badminton",
      slug: "badminton",
      name: "Badminton",
      category: "Court Reservation",
      description:
        "Professional indoor badminton courts with premium playing facilities and optional coaching programs for all skill levels.",
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea",
      bookingRules: { requiresCoach: false, autoAssignCourt: false },
      timetable: {
        monday: { morning: ["5:30 AM - 7:30 AM", "8:30 AM - 12:30 PM"], evening: ["2:30 PM - 5:30 PM", "5:30 PM - 7:30 PM"] },
        tuesday: { morning: ["5:30 AM - 7:30 AM", "8:30 AM - 12:30 PM"], evening: ["2:30 PM - 5:30 PM", "5:30 PM - 7:30 PM"] },
        wednesday: { morning: ["5:30 AM - 7:30 AM", "8:30 AM - 12:30 PM"], evening: ["3:00 PM - 6:00 PM", "6:30 PM - 9:00 PM"] },
        thursday: { morning: ["5:30 AM - 7:30 AM", "8:30 AM - 12:30 PM"], evening: ["2:30 PM - 5:30 PM", "5:30 PM - 7:30 PM"] },
        friday: { morning: ["5:30 AM - 7:30 AM", "8:30 AM - 12:30 PM"], evening: ["2:30 PM - 5:30 PM", "5:30 PM - 7:30 PM"] },
        saturday: { morning: ["8:30 AM - 12:00 PM"], evening: ["3:30 PM - 6:30 PM", "6:30 PM - 9:00 PM"] },
        sunday: { morning: ["8:30 AM - 12:00 PM"], evening: ["3:00 PM - 6:00 PM", "6:30 PM - 9:00 PM"] },
      },
      courts: [
        { id: 1, name: "Court 1", pricePerHour: 800, capacity: "4 Players" },
        { id: 2, name: "Court 2", pricePerHour: 800, capacity: "4 Players" },
        { id: 3, name: "Court 3", pricePerHour: 900, capacity: "6 Players" },
        { id: 4, name: "Court 4", pricePerHour: 900, capacity: "6 Players" },
      ],
      coaches: [
        { id: 1, name: "Kasun Fernando", experience: "8 Years Experience", rating: "4.9", price: 3000, speciality: "Advanced Match Training", description: "Professional badminton coach focused on advanced gameplay." },
        { id: 2, name: "Nimal Perera", experience: "6 Years Experience", rating: "4.8", price: 2500, speciality: "Beginner Coaching", description: "Specialized in beginner development and fundamentals." },
      ],
      equipment: [
        { id: "eq-bad-racket", name: "Badminton Racket", rentalPrice: 600, availability: "Available", sportSlug: "badminton" },
        { id: "eq-bad-shuttle", name: "Shuttlecock Tube", rentalPrice: 450, availability: "Low Stock", sportSlug: "badminton" },
        { id: "eq-bad-grip", name: "Grip Tape", rentalPrice: 200, availability: "Available", sportSlug: "badminton" },
      ],
    },
    {
      id: "sport-table-tennis",
      slug: "table-tennis",
      name: "Table Tennis",
      category: "Coach Guided Sessions",
      description: "Professional table tennis coaching sessions with guided training programs.",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      bookingRules: { requiresCoach: true, autoAssignCourt: true },
      coaches: [
        { id: 1, name: "Ashen Perera", experience: "7 Years Experience", rating: "4.9", price: 3500, speciality: "Speed & Spin Techniques", assignedTable: "Table 1", assignedSession: "8:00 AM - 10:00 AM", description: "Elite table tennis trainer for advanced drills." },
        { id: 2, name: "Dulanjan Silva", experience: "5 Years Experience", rating: "4.8", price: 3000, speciality: "Youth Development", assignedTable: "Table 2", assignedSession: "10:30 AM - 12:30 PM", description: "Focused on youth player development." },
      ],
      equipment: [
        { id: "eq-tt-paddle", name: "Table Tennis Paddle", rentalPrice: 700, availability: "Available", sportSlug: "table-tennis" },
        { id: "eq-tt-balls", name: "Table Tennis Ball Set", rentalPrice: 350, availability: "Available", sportSlug: "table-tennis" },
        { id: "eq-tt-cover", name: "Paddle Cover", rentalPrice: 250, availability: "Low Stock", sportSlug: "table-tennis" },
      ],
    },
    {
      id: "sport-basketball",
      slug: "basketball",
      name: "Basketball",
      category: "Court Reservation",
      description: "Professional indoor basketball courts suitable for training sessions and matches.",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
      bookingRules: { requiresCoach: false, autoAssignCourt: false },
      timetable: {
        monday: { morning: ["8:00 AM - 10:00 AM"], evening: ["4:00 PM - 6:00 PM", "6:00 PM - 8:00 PM"] },
        tuesday: { morning: ["8:00 AM - 10:00 AM"], evening: ["4:00 PM - 6:00 PM", "6:00 PM - 8:00 PM"] },
      },
      courts: [
        { id: 1, name: "Basketball Court A", pricePerHour: 2500, capacity: "10 Players" },
        { id: 2, name: "Basketball Court B", pricePerHour: 2500, capacity: "10 Players" },
      ],
      coaches: [],
      equipment: [
        { id: "eq-bb-ball", name: "Basketball", rentalPrice: 800, availability: "Available", sportSlug: "basketball" },
        { id: "eq-bb-bibs", name: "Training Bib Set", rentalPrice: 500, availability: "Available", sportSlug: "basketball" },
        { id: "eq-bb-whistle", name: "Whistle", rentalPrice: 150, availability: "Available", sportSlug: "basketball" },
      ],
    },
    {
      id: "sport-volleyball",
      slug: "volleyball",
      name: "Volleyball",
      category: "Court Reservation",
      description: "Premium volleyball courts designed for recreational games and team practice.",
      image: "https://images.unsplash.com/photo-1592656094267-764a45160876",
      bookingRules: { requiresCoach: false, autoAssignCourt: false },
      timetable: {
        monday: { morning: ["8:00 AM - 10:00 AM"], evening: ["4:00 PM - 6:00 PM"] },
        tuesday: { morning: ["8:00 AM - 10:00 AM"], evening: ["4:00 PM - 6:00 PM"] },
      },
      courts: [
        { id: 1, name: "Volleyball Court A", pricePerHour: 2000, capacity: "12 Players" },
        { id: 2, name: "Volleyball Court B", pricePerHour: 2000, capacity: "12 Players" },
      ],
      coaches: [],
      equipment: [
        { id: "eq-vb-ball", name: "Volleyball", rentalPrice: 700, availability: "Available", sportSlug: "volleyball" },
        { id: "eq-vb-knee", name: "Knee Pads", rentalPrice: 500, availability: "Limited", sportSlug: "volleyball" },
        { id: "eq-vb-cones", name: "Training Cones", rentalPrice: 400, availability: "Available", sportSlug: "volleyball" },
      ],
    },
  ],
  bookings: [],
  payments: [],
  notifications: [],
  contactMessages: [],
  meta: { createdAt: nowIso(), lastUpdatedAt: nowIso() },
};

export const DB_KEY = "sportsComplexMockDb";

export function getDb() {
  const stored = localStorage.getItem(DB_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(DB_KEY, JSON.stringify(seedData));
  return seedData;
}

export function setDb(nextDb) {
  const updated = { ...nextDb, meta: { ...nextDb.meta, lastUpdatedAt: nowIso() } };
  localStorage.setItem(DB_KEY, JSON.stringify(updated));
  return updated;
}
