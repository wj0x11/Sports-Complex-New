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
  }
};

