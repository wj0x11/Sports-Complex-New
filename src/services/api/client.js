import axios from 'axios';


const API_URL = "http://localhost:5000";


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = {
  async login(payload) {
    const response = await api.post('/login', payload);
    return response.data;
  },


  async registerUser(payload) {
    const response = await api.post('/register', payload);
    return response.data;
  },


  async getSports() {
    const response = await api.get('/sports');
    return response.data;
  },


  async getSportBySlug(slug) {
    const response = await api.get(`/sports/${slug}`);
    return response.data;
  },


  async getUserBookings(userEmail) {
    const response = await api.get(`/bookings?email=${userEmail}`);
    return response.data;
  },


  async createBooking(payload) {
    const response = await api.post('/bookings', payload);
    return response.data;
  },

  async getDashboardData(userEmail) {
    const response = await api.get(`/dashboard/${userEmail}`);
    return response.data;
  },

  async getAdminDashboardData(userEmail) {
    const response = await api.get(`/admin-dashboard/${userEmail}`);
    return response.data;
  },

  async getAdminOverview() {
    const bookings = JSON.parse(localStorage.getItem("sportsBookings")) || [];
    const defaultSports = [
      { id: "sport-badminton", name: "Badminton" },
      { id: "sport-table-tennis", name: "Table Tennis" },
      { id: "sport-basketball", name: "Basketball" },
      { id: "sport-volleyball", name: "Volleyball" }
    ];
    let sports = defaultSports;
    try {
      const storedDb = JSON.parse(localStorage.getItem("sportsComplexMockDb"));
      if (storedDb && storedDb.sports) {
        sports = storedDb.sports;
      }
    } catch (e) {
      console.error(e);
    }

    const utilizationMap = {};
    sports.forEach(s => {
      utilizationMap[s.name] = 0;
    });

    bookings.forEach(b => {
      const sportName = b.sport?.name || b.sport || "Unknown";
      if (utilizationMap[sportName] !== undefined) {
        utilizationMap[sportName]++;
      }
    });

    const utilization = sports.map(s => ({
      sport: s.name,
      usageCount: utilizationMap[s.name] || 0
    }));

    return {
      bookings,
      sports,
      utilization
    };
  },

  async updateBookingStatus(bookingId, status) {
    try {
      const bookings = JSON.parse(localStorage.getItem("sportsBookings")) || [];
      const updated = bookings.map(b => b.id === bookingId ? { ...b, status } : b);
      localStorage.setItem("sportsBookings", JSON.stringify(updated));
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  }
};
