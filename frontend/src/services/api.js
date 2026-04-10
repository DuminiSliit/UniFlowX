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

// Resources API
export const getResources = async () => {
    const response = await api.get('/resources');
    return response.data;
};

export const createResource = async (resourceData) => {
    const response = await api.post('/resources', resourceData);
    return response.data;
};

export const updateResource = async (id, resourceData) => {
    const response = await api.put(`/resources/${id}`, resourceData);
    return response.data;
};

export const deleteResource = async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
};

export default api;
