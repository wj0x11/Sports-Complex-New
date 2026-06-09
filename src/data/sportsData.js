const sportsData = [
  {
    id: 1,

    slug: "badminton",

    name: "Badminton",

    category: "Court Reservation",

    description:
      "Professional indoor badminton courts with premium playing facilities and optional coaching programs for all skill levels.",

    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea",

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
      {
        id: 1,

        name: "Court 1",

        pricePerHour: 800,

        capacity: "4 Players",
      },

      {
        id: 2,

        name: "Court 2",

        pricePerHour: 800,

        capacity: "4 Players",
      },

      {
        id: 3,

        name: "Court 3",

        pricePerHour: 900,

        capacity: "6 Players",
      },

      {
        id: 4,

        name: "Court 4",

        pricePerHour: 900,

        capacity: "6 Players",
      },
    ],

    coaches: [
      {
        id: 1,

        name: "Kasun Fernando",

        experience: "8 Years Experience",

        rating: "4.9",

        price: 3000,

        speciality: "Advanced Match Training",

        description:
          "Professional badminton coach focused on advanced gameplay, tournament preparation, and competitive doubles strategy.",
      },

      {
        id: 2,

        name: "Nimal Perera",

        experience: "6 Years Experience",

        rating: "4.8",

        price: 2500,

        speciality: "Beginner Coaching",

        description:
          "Specialized in beginner development, movement fundamentals, and skill-building sessions for new players.",
      },

      {
        id: 3,

        name: "Ravin Silva",

        experience: "5 Years Experience",

        rating: "4.7",

        price: 2800,

        speciality: "Doubles Strategy Training",

        description:
          "Experienced doubles coach focused on communication, court awareness, tactical positioning, and fast rally sessions.",
      },

      {
        id: 4,

        name: "Sahan Jayawardena",

        experience: "7 Years Experience",

        rating: "4.8",

        price: 3200,

        speciality: "Junior Athlete Coaching",

        description:
          "Provides structured coaching for junior players with performance tracking and fitness-focused training.",
      },
    ],
  },

  {
    id: 2,

    slug: "table-tennis",

    name: "Table Tennis",

    category: "Coach Guided Sessions",

    description:
      "Professional table tennis coaching sessions with guided training programs and premium indoor facilities.",

    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",

    bookingRules: {
      requiresCoach: true,

      autoAssignCourt: true,
    },

    coaches: [
      {
        id: 1,

        name: "Ashen Perera",

        experience: "7 Years Experience",

        rating: "4.9",

        price: 3500,

        speciality: "Speed & Spin Techniques",

        assignedTable: "Table 1",

        assignedSession: "8:00 AM - 10:00 AM",

        description:
          "Elite table tennis trainer specializing in speed control, spin mechanics, and advanced competitive drills.",
      },

      {
        id: 2,

        name: "Dulanjan Silva",

        experience: "5 Years Experience",

        rating: "4.8",

        price: 3000,

        speciality: "Youth Development",

        assignedTable: "Table 2",

        assignedSession: "10:30 AM - 12:30 PM",

        description:
          "Focused on youth player development with structured training sessions and tactical fundamentals.",
      },

      {
        id: 3,

        name: "Kavindu Senanayake",

        experience: "6 Years Experience",

        rating: "4.7",

        price: 3200,

        speciality: "Professional Match Coaching",

        assignedTable: "Table 3",

        assignedSession: "3:00 PM - 5:00 PM",

        description:
          "Provides high-performance coaching sessions with tournament preparation and live match simulation.",
      },

      {
        id: 4,

        name: "Tharindu Wickramasinghe",

        experience: "4 Years Experience",

        rating: "4.6",

        price: 2800,

        speciality: "Beginner Skill Training",

        assignedTable: "Table 1",

        assignedSession: "6:00 PM - 8:00 PM",

        description:
          "Beginner-friendly coach focused on hand control, serving accuracy, and movement coordination.",
      },
    ],
  },
];

export default sportsData;
