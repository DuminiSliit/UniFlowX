import api from './api';

const ticketService = {
  // Get all tickets
  getAllTickets: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const response = await api.get('/tickets', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Search/filter tickets
  searchTickets: async (filters = {}, page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const params = { page, size, sortBy, sortDir, ...filters };
    const response = await api.get('/tickets/search', { params });
    return response.data;
  },

  // Get ticket by ID
  getTicketById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // Create new ticket
  createTicket: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  // Update ticket status
  updateTicketStatus: async (id, statusData) => {
    const response = await api.put(`/tickets/${id}/status`, statusData);
    return response.data;
  },

  // Assign ticket
  assignTicket: async (id, assignData) => {
    const response = await api.put(`/tickets/${id}/assign`, assignData);
    return response.data;
  },

  // Delete ticket
  deleteTicket: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },

  // Get ticket comments
  getTicketComments: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  // Add comment to ticket
  addComment: async (ticketId, commentData) => {
    const response = await api.post(`/tickets/${ticketId}/comments`, commentData);
    return response.data;
  },

  // Update comment
  updateComment: async (commentId, commentData) => {
    const response = await api.put(`/comments/${commentId}`, commentData);
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  // Upload attachment
  uploadAttachment: async (ticketId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/tickets/${ticketId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete attachment
  deleteAttachment: async (attachmentId) => {
    const response = await api.delete(`/attachments/${attachmentId}`);
    return response.data;
  },

  // Download attachment
  downloadAttachment: async (attachmentId) => {
    const response = await api.get(`/attachments/${attachmentId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default ticketService;
