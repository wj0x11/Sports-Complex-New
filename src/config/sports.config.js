/**
 * Single source of truth for all sports definitions.
 * To add a sport, edit ONLY this file.
 */

const courtSessionSchedule = {
  monday: {
    morning: ["6:00 AM - 9:00 AM", "9:30 AM - 12:30 PM"],
    evening: ["2:00 PM - 5:00 PM", "5:30 PM - 8:30 PM"],
  },
  tuesday: {
    morning: ["6:00 AM - 9:00 AM", "9:30 AM - 12:30 PM"],
    evening: ["2:00 PM - 5:00 PM", "5:30 PM - 8:30 PM"],
  },
  wednesday: {
    morning: ["6:00 AM - 9:00 AM", "9:30 AM - 12:30 PM"],
    evening: ["2:00 PM - 5:00 PM", "5:30 PM - 8:30 PM"],
  },
  thursday: {
    morning: ["6:00 AM - 9:00 AM", "9:30 AM - 12:30 PM"],
    evening: ["2:00 PM - 5:00 PM", "5:30 PM - 8:30 PM"],
  },
  friday: {
    morning: ["6:00 AM - 9:00 AM", "9:30 AM - 12:30 PM"],
    evening: ["2:00 PM - 5:00 PM", "5:30 PM - 8:30 PM"],
  },
  saturday: {
    morning: ["7:00 AM - 11:00 AM"],
    evening: ["3:00 PM - 7:00 PM"],
  },
  sunday: {
    morning: ["7:00 AM - 11:00 AM"],
    evening: ["3:00 PM - 7:00 PM"],
  },
};

export const SPORTS = [
  {
    id: 1,
    name: "Table Tennis",
    slug: "table-tennis",
    featured: true,
    type: "court",
    hasTimetable: false,
    category: "Indoor Court Reservation",
    description:
      "Professional indoor table tennis facilities featuring international-standard tables, premium equipment, and expert coaching for players of all skill levels.",
    image:
      "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=1200&h=600&fit=crop",
    bookingRules: {
      requiresCoach: false,
      autoAssignCourt: false,
    },
    timetable: courtSessionSchedule,
    bookedSlots: {},
    courts: [
      { id: 1, name: "Table 1", pricePerHour: 1500, capacity: "2 Players" },
      { id: 2, name: "Table 2", pricePerHour: 1500, capacity: "2 Players" },
      { id: 3, name: "Training Table", pricePerHour: 1200, capacity: "2 Players" },
    ],
    coaches: [
      {
        id: 301,
        name: "Nimal Perera",
        position: "Head Table Tennis Coach",
        experience: "8 Years Experience",
        rating: "4.9",
        price: 3000,
        speciality: "Beginner & Intermediate Training",
        photo:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        description:
          "Experienced coach specializing in stroke techniques, footwork, and skill development for beginner and intermediate players.",
      },
      {
        id: 302,
        name: "Kasun Fernando",
        position: "Senior Table Tennis Coach",
        experience: "12 Years Experience",
        rating: "4.9",
        price: 3800,
        speciality: "Advanced Techniques & Tournament Preparation",
        photo:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        description:
          "Specializes in advanced gameplay strategies, competitive coaching, and tournament preparation for serious athletes.",
      },
      {
        id: 303,
        name: "Dilshan Silva",
        position: "Youth Development Coach",
        experience: "6 Years Experience",
        rating: "4.8",
        price: 2600,
        speciality: "Youth Coaching",
        photo:
          "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=400&fit=crop",
        description:
          "Dedicated to coaching young players through engaging training sessions that build strong fundamentals and confidence.",
      },
    ],
    equipment: [
      { id: "tt-1", name: "Table Tennis Racket", rentalPrice: 300 },
      { id: "tt-2", name: "Training Balls", rentalPrice: 150 },
      { id: "tt-3", name: "Ball Collection Basket", rentalPrice: 200 },
    ],
    bookingInfo:
      "Reserve your preferred table by selecting the date and time slot. Optional coaching sessions and equipment rentals can be added during the booking process.",
  },
  {
    id: 2,
    name: "Badminton",
    slug: "badminton",
    featured: true,
    type: "court",
    hasTimetable: true,
    category: "Court Reservation",
    description:
      "Professional indoor badminton courts with premium playing facilities and optional coaching programs for all skill levels.",
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&h=600&fit=crop",
    bookingRules: {
      requiresCoach: false,
      autoAssignCourt: false,
    },
    timetable: {
      monday: {
        morning: ["5:30 AM - 7:30 AM", "8:30 AM - 12:30 PM"],
        evening: ["2:30 PM - 5:30 PM", "5:30 PM - 7:30 PM"],
      },
      tuesday: {
        morning: ["5:30 AM - 7:30 AM", "8:30 AM - 12:30 PM"],
        evening: ["2:30 PM - 5:30 PM", "5:30 PM - 7:30 PM"],
      },
      wednesday: {
        morning: ["5:30 AM - 7:30 AM", "8:30 AM - 12:30 PM"],
        evening: ["3:00 PM - 6:00 PM", "6:30 PM - 9:00 PM"],
      },
      thursday: {
        morning: ["5:30 AM - 7:30 AM", "8:30 AM - 12:30 PM"],
        evening: ["2:30 PM - 5:30 PM", "5:30 PM - 7:30 PM"],
      },
      friday: {
        morning: ["5:30 AM - 7:30 AM", "8:30 AM - 12:30 PM"],
        evening: ["2:30 PM - 5:30 PM", "5:30 PM - 7:30 PM"],
      },
      saturday: {
        morning: ["8:30 AM - 12:00 PM"],
        evening: ["3:30 PM - 6:30 PM", "6:30 PM - 9:00 PM"],
      },
      sunday: {
        morning: ["8:30 AM - 12:00 PM"],
        evening: ["3:00 PM - 6:00 PM", "6:30 PM - 9:00 PM"],
      },
    },
    bookedSlots: {
      "2026-05-25": {
        1: ["5:30 AM - 7:30 AM"],
        2: ["5:30 PM - 7:30 PM"],
        3: ["8:30 AM - 12:30 PM"],
      },
      "2026-05-26": {
        1: ["2:30 PM - 5:30 PM"],
      },
    },
    courts: [
      { id: 1, name: "Court 1", pricePerHour: 800, capacity: "4 Players" },
      { id: 2, name: "Court 2", pricePerHour: 800, capacity: "4 Players" },
      { id: 3, name: "Court 3", pricePerHour: 900, capacity: "6 Players" },
      { id: 4, name: "Court 4", pricePerHour: 900, capacity: "6 Players" },
    ],
    coaches: [
      {
        id: 101,
        name: "Kasun Fernando",
        position: "Senior Badminton Coach",
        experience: "8 Years Experience",
        rating: "4.9",
        price: 3000,
        speciality: "Advanced Match Training",
        photo:
          "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400&h=400&fit=crop",
        description:
          "Professional badminton coach focused on advanced gameplay, tournament preparation, and competitive doubles strategy.",
      },
      {
        id: 102,
        name: "Nimal Perera",
        position: "Beginner Coach",
        experience: "6 Years Experience",
        rating: "4.8",
        price: 2500,
        speciality: "Beginner Coaching",
        photo:
          "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=400&fit=crop",
        description:
          "Specialized in beginner development, movement fundamentals, and skill-building sessions for new players.",
      },
      {
        id: 103,
        name: "Ravin Silva",
        position: "Doubles Specialist",
        experience: "5 Years Experience",
        rating: "4.7",
        price: 2800,
        speciality: "Doubles Strategy Training",
        photo:
          "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=400&fit=crop",
        description:
          "Experienced doubles coach focused on communication, court awareness, tactical positioning, and fast rally sessions.",
      },
      {
        id: 104,
        name: "Sahan Jayawardena",
        position: "Junior Coach",
        experience: "7 Years Experience",
        rating: "4.8",
        price: 3200,
        speciality: "Junior Athlete Coaching",
        photo:
          "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=400&fit=crop",
        description:
          "Provides structured coaching for junior players with performance tracking and fitness-focused training.",
      },
    ],
    equipment: [
      { id: "bd-1", name: "Badminton Racket", rentalPrice: 600 },
      { id: "bd-2", name: "Shuttlecock", rentalPrice: 300 },
      { id: "bd-3", name: "Court Shoes", rentalPrice: 700 },
    ],
    bookingInfo:
      "Select a court, choose your date and time slot, and optionally add coaching or equipment rentals before checkout.",
  },
  {
    id: 3,
    name: "Basketball",
    slug: "basketball",
    featured: true,
    type: "court",
    hasTimetable: false,
    category: "Court Reservation",
    description:
      "Indoor basketball courts with professional flooring, scoreboards, and training facilities for individuals and teams.",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=600&fit=crop",
    bookingRules: {
      requiresCoach: false,
      autoAssignCourt: false,
    },
    timetable: courtSessionSchedule,
    bookedSlots: {},
    courts: [
      { id: 1, name: "Main Court", pricePerHour: 2000, capacity: "10 Players" },
      { id: 2, name: "Practice Court", pricePerHour: 1500, capacity: "6 Players" },
    ],
    coaches: [
      {
        id: 401,
        name: "Jason Mendis",
        position: "Head Basketball Coach",
        experience: "10 Years Experience",
        rating: "4.9",
        price: 3500,
        speciality: "Offensive Playmaking",
        photo:
          "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop",
        description:
          "Experienced coach specializing in shooting mechanics, ball handling, and team offensive strategies.",
      },
      {
        id: 402,
        name: "Kevin Silva",
        position: "Defensive Coach",
        experience: "7 Years Experience",
        rating: "4.8",
        price: 3000,
        speciality: "Defensive Fundamentals",
        photo:
          "https://images.unsplash.com/photo-1519861537503-b4912a7f0b0e?w=400&h=400&fit=crop",
        description:
          "Focuses on defensive positioning, rebounding drills, and competitive scrimmage sessions.",
      },
    ],
    equipment: [
      { id: "bb-1", name: "Basketball", rentalPrice: 400 },
      { id: "bb-2", name: "Basketball Shoes", rentalPrice: 900 },
    ],
    bookingInfo:
      "Book a basketball court by selecting your court, date, and time. Add optional coaching or equipment rentals.",
  },
  {
    id: 4,
    name: "Volleyball",
    slug: "volleyball",
    featured: true,
    type: "court",
    hasTimetable: false,
    category: "Court Reservation",
    description:
      "Professional indoor volleyball courts with regulation nets, quality flooring, and facilities for recreational and competitive play.",
    image:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1200&h=600&fit=crop",
    bookingRules: {
      requiresCoach: false,
      autoAssignCourt: false,
    },
    timetable: courtSessionSchedule,
    bookedSlots: {},
    courts: [
      { id: 1, name: "Court 1", pricePerHour: 1800, capacity: "12 Players" },
      { id: 2, name: "Court 2", pricePerHour: 1800, capacity: "12 Players" },
    ],
    coaches: [
      {
        id: 501,
        name: "Sanduni Jayasinghe",
        position: "Head Volleyball Coach",
        experience: "9 Years Experience",
        rating: "4.9",
        price: 3200,
        speciality: "Team Coordination",
        photo:
          "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=400&fit=crop",
        description:
          "National-level coach focused on team rotations, serve-receive drills, and competitive match preparation.",
      },
      {
        id: 502,
        name: "Nadeesha Kumari",
        position: "Spike Coach",
        experience: "6 Years Experience",
        rating: "4.8",
        price: 2800,
        speciality: "Attacking Techniques",
        photo:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        description:
          "Specializes in spike technique, blocking fundamentals, and power training for front-row players.",
      },
    ],
    equipment: [
      { id: "vb-1", name: "Volleyball", rentalPrice: 400 },
      { id: "vb-2", name: "Knee Pads", rentalPrice: 350 },
      { id: "vb-3", name: "Volleyball Shoes", rentalPrice: 800 },
    ],
    bookingInfo:
      "Reserve a volleyball court by choosing your court, date, and time slot. Equipment and coaching are available as add-ons.",
  },
];
