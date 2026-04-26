import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token || null;
};

// Create axios instance with auth headers
const createAuthInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });
};

const ticketService = {
  // Get all tickets
  getAllTickets: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const authInstance = createAuthInstance();
    const response = await authInstance.get('/tickets', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Search/filter tickets
  searchTickets: async (filters = {}, page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const authInstance = createAuthInstance();
    const params = { page, size, sortBy, sortDir, ...filters };
    const response = await authInstance.get('/tickets/search', { params });
    return response.data;
  },

  // Get ticket by ID
  getTicketById: async (id) => {
    const authInstance = createAuthInstance();
    const response = await authInstance.get(`/tickets/${id}`);
    return response.data;
  },

  // Create new ticket
  createTicket: async (ticketData) => {
    const authInstance = createAuthInstance();
    const response = await authInstance.post('/tickets', ticketData);
    return response.data;
  },

  // Update ticket
  updateTicket: async (id, ticketData) => {
    const authInstance = createAuthInstance();
    const response = await authInstance.put(`/tickets/${id}`, ticketData);
    return response.data;
  },

  // Update ticket status
  updateTicketStatus: async (id, statusData) => {
    const authInstance = createAuthInstance();
    const response = await authInstance.put(`/tickets/${id}/status`, statusData);
    return response.data;
  },

  // Delete ticket
  deleteTicket: async (id) => {
    const authInstance = createAuthInstance();
    const response = await authInstance.delete(`/tickets/${id}`);
    return response.data;
  },

  // Assign ticket
  assignTicket: async (id, assignData) => {
    const authInstance = createAuthInstance();
    const response = await authInstance.put(`/tickets/${id}/assign`, assignData);
    return response.data;
  },

  // Get ticket comments
  getTicketComments: async (ticketId) => {
    const authInstance = createAuthInstance();
    const response = await authInstance.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  // Add comment to ticket
  addComment: async (ticketId, commentData) => {
    const authInstance = createAuthInstance();
    const response = await authInstance.post(`/tickets/${ticketId}/comments`, commentData);
    return response.data;
  },

  // Update comment
  updateComment: async (commentId, commentData) => {
    const authInstance = createAuthInstance();
    const response = await authInstance.put(`/comments/${commentId}`, commentData);
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const authInstance = createAuthInstance();
    const response = await authInstance.delete(`/comments/${commentId}`);
    return response.data;
  },

  // Upload attachment
  uploadAttachment: async (ticketId, file) => {
    const authInstance = createAuthInstance();
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await authInstance.post(`/tickets/${ticketId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete attachment
  deleteAttachment: async (attachmentId) => {
    const authInstance = createAuthInstance();
    const response = await authInstance.delete(`/attachments/${attachmentId}`);
    return response.data;
  },

  // Download attachment
  downloadAttachment: async (attachmentId) => {
    const authInstance = createAuthInstance();
    const response = await authInstance.get(`/attachments/${attachmentId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default ticketService;
