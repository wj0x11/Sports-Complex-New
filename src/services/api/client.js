import axios from 'axios';
import { getAdminSportSummaries } from '../sports.service';

 
const API_URL = "http://localhost:5000/api";

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
  
    const response = await api.get('/bookings');
    const bookings = response.data;
    const sports = getAdminSportSummaries() || [];

    const utilizationMap = {};
    sports.forEach((s) => {
      utilizationMap[s.name] = 0;
    });

    bookings.forEach((b) => {
      const sportName = b.sport?.name || b.sport || "Unknown";
      if (utilizationMap[sportName] !== undefined) {
        utilizationMap[sportName]++;
      }
    });

    const utilization = sports.map((s) => ({
      sport: s.name,
      slug: s.slug,
      usageCount: utilizationMap[s.name] || 0,
    }));

    return {
      bookings,
      sports,
      utilization,
    };
  },

  async submitContact(payload) {
    const response = await api.post('/contact', payload);
    return response.data;
  },

  async getContactMessages() {
    const response = await api.get('/contact');
    return response.data;
  },

  async updateBookingStatus(bookingId, status) {
    try {
      const response = await api.put(`/bookings/${bookingId}`, { status });
      window.dispatchEvent(new Event("bookings-updated"));
      return response.data;
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  },

  async getBookedSlots(sportSlug, date, facilityId) {
    const response = await api.get('/bookings/booked-slots', {
      params: { sportSlug, date, facilityId }
    });
    return response.data;
  },

  async getNotifications(email) {
    const response = await api.get('/notifications', {
      params: { email }
    });
    return response.data;
  },

  async markNotificationsRead(email) {
    const response = await api.put('/notifications/mark-read', { email });
    return response.data;
  },

  async getUsers() {
    const response = await api.get('/users');
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async getCourts(sportSlug) {
    const response = await api.get('/courts', { params: { sportSlug } });
    return response.data;
  },

  async createCourt(payload) {
    const response = await api.post('/courts', payload);
    return response.data;
  },

  async updateCourt(id, payload) {
    const response = await api.put(`/courts/${id}`, payload);
    return response.data;
  },

  async deleteCourt(id) {
    const response = await api.delete(`/courts/${id}`);
    return response.data;
  },

  async getCoaches(sportSlug) {
    const response = await api.get('/coaches', { params: { sportSlug } });
    return response.data;
  },

  async createCoach(payload) {
    const response = await api.post('/coaches', payload);
    return response.data;
  },

  async updateCoach(id, payload) {
    const response = await api.put(`/coaches/${id}`, payload);
    return response.data;
  },

  async deleteCoach(id) {
    const response = await api.delete(`/coaches/${id}`);
    return response.data;
  },

  async getMemberships(userEmail) {
    const response = await api.get('/memberships', userEmail ? { params: { userEmail } } : {});
    return response.data;
  },

  async createMembership(payload) {
    const response = await api.post('/memberships', payload);
    return response.data;
  },

  async updateMembership(id, payload) {
    const response = await api.put(`/memberships/${id}`, payload);
    return response.data;
  },

  async deleteMembership(id) {
    const response = await api.delete(`/memberships/${id}`);
    return response.data;
  },

  async getNotifications(email) {
    const response = await api.get('/notifications', email ? { params: { email } } : {});
    return response.data;
  },

  async createNotification(payload) {
    const response = await api.post('/notifications', payload);
    return response.data;
  },

  async markNotificationRead(id) {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  async getPayments(userEmail) {
    const response = await api.get('/payments', { params: { userEmail } });
    return response.data;
  },

  async createPayment(payload) {
    const response = await api.post('/payments', payload);
    return response.data;
  },

  async getEquipment(sportSlug) {
    const response = await api.get('/equipment', { params: { sportSlug } });
    return response.data;
  },

  async createEquipment(payload) {
    const response = await api.post('/equipment', payload);
    return response.data;
  },

  async updateEquipment(id, payload) {
    const response = await api.put(`/equipment/${id}`, payload);
    return response.data;
  },

  async deleteEquipment(id) {
    const response = await api.delete(`/equipment/${id}`);
    return response.data;
  },

  async getEquipmentRentals(userEmail) {
    const response = await api.get('/equipment-rentals', { params: { userEmail } });
    return response.data;
  },

  async createEquipmentRental(payload) {
    const response = await api.post('/equipment-rentals', payload);
    return response.data;
  },

  async updateEquipmentRental(id, payload) {
    const response = await api.put(`/equipment-rentals/${id}`, payload);
    return response.data;
  },

  async getTournaments() {
    const response = await api.get('/tournaments');
    return response.data;
  },

  async createTournament(payload) {
    const response = await api.post('/tournaments', payload);
    return response.data;
  },

  async updateTournament(id, payload) {
    const response = await api.put(`/tournaments/${id}`, payload);
    return response.data;
  },

  async deleteTournament(id) {
    const response = await api.delete(`/tournaments/${id}`);
    return response.data;
  },

  async getFeedback() {
    const response = await api.get('/feedback');
    return response.data;
  },

  async createFeedback(payload) {
    const response = await api.post('/feedback', payload);
    return response.data;
  },

  async updateFeedback(id, payload) {
    const response = await api.put(`/feedback/${id}`, payload);
    return response.data;
  },

  async deleteFeedback(id) {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  },

  async getTrainingSessions(coachId) {
    const response = await api.get('/training-sessions', { params: { coachId } });
    return response.data;
  },

  async createTrainingSession(payload) {
    const response = await api.post('/training-sessions', payload);
    return response.data;
  },

  async updateTrainingSession(id, payload) {
    const response = await api.put(`/training-sessions/${id}`, payload);
    return response.data;
  },

  async deleteTrainingSession(id) {
    const response = await api.delete(`/training-sessions/${id}`);
    return response.data;
  },

  async getDashboardStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};

