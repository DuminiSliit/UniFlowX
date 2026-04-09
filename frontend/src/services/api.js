import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const bookingService = {
    createBooking: (booking) => api.post('/bookings', booking),
    getMyBookings: () => api.get('/bookings/my'),
    getAllBookings: () => api.get('/bookings'),
    updateStatus: (id, status, rejectionReason) => 
        api.put(`/bookings/${id}/status`, { status, rejectionReason }),
    cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
};

export default api;
