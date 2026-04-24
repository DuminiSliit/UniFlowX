import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const ticketService = {
  // Get all tickets
  getAllTickets: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const response = await axios.get(`${API_BASE_URL}/tickets`, {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Search/filter tickets
  searchTickets: async (filters = {}, page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const params = { page, size, sortBy, sortDir, ...filters };
    const response = await axios.get(`${API_BASE_URL}/tickets/search`, { params });
    return response.data;
  },

  // Get ticket by ID
  getTicketById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/tickets/${id}`);
    return response.data;
  },

  // Create new ticket
  createTicket: async (ticketData) => {
    const response = await axios.post(`${API_BASE_URL}/tickets`, ticketData);
    return response.data;
  },

  // Update ticket status
  updateTicketStatus: async (id, statusData) => {
    const response = await axios.put(`${API_BASE_URL}/tickets/${id}/status`, statusData);
    return response.data;
  },

  // Assign ticket
  assignTicket: async (id, assignData) => {
    const response = await axios.put(`${API_BASE_URL}/tickets/${id}/assign`, assignData);
    return response.data;
  },

  // Delete ticket
  deleteTicket: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/tickets/${id}`);
    return response.data;
  },

  // Get ticket comments
  getTicketComments: async (ticketId) => {
    const response = await axios.get(`${API_BASE_URL}/tickets/${ticketId}/comments`);
    return response.data;
  },

  // Add comment to ticket
  addComment: async (ticketId, commentData) => {
    const response = await axios.post(`${API_BASE_URL}/tickets/${ticketId}/comments`, commentData);
    return response.data;
  },

  // Update comment
  updateComment: async (commentId, commentData) => {
    const response = await axios.put(`${API_BASE_URL}/comments/${commentId}`, commentData);
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const response = await axios.delete(`${API_BASE_URL}/comments/${commentId}`);
    return response.data;
  },

  // Upload attachment
  uploadAttachment: async (ticketId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/tickets/${ticketId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete attachment
  deleteAttachment: async (attachmentId) => {
    const response = await axios.delete(`${API_BASE_URL}/attachments/${attachmentId}`);
    return response.data;
  },

  // Download attachment
  downloadAttachment: async (attachmentId) => {
    const response = await axios.get(`${API_BASE_URL}/attachments/${attachmentId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default ticketService;
