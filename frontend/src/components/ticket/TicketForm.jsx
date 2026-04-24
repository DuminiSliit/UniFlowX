import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../../services/ticketService';

const TicketForm = ({ ticketId, isEdit = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resources, setResources] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'EQUIPMENT',
    priority: 'MEDIUM',
    resourceId: '',
    location: '',
    preferredContact: ''
  });

  const ticketCategories = ['EQUIPMENT', 'FACILITY', 'NETWORK', 'SOFTWARE', 'OTHER'];
  const ticketPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  useEffect(() => {
    // In a real implementation, you would fetch resources from the API
    // For now, we'll use mock data
    setResources([
      { id: 1, name: 'Projector A', type: 'EQUIPMENT' },
      { id: 2, name: 'Computer Lab 1', type: 'FACILITY' },
      { id: 3, name: 'WiFi Router', type: 'NETWORK' }
    ]);

    if (isEdit && ticketId) {
      fetchTicket();
    }
  }, [ticketId, isEdit]);

  const fetchTicket = async () => {
    try {
      const ticket = await ticketService.getTicketById(ticketId);
      setFormData({
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        resourceId: ticket.resource?.id || '',
        location: ticket.location || '',
        preferredContact: ticket.preferredContact || ''
      });
    } catch (err) {
      setError('Failed to fetch ticket details');
      console.error('Error fetching ticket:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEdit) {
        await ticketService.updateTicket(ticketId, formData);
        setSuccess('Ticket updated successfully');
      } else {
        await ticketService.createTicket(formData);
        setSuccess('Ticket created successfully');
      }

      setTimeout(() => {
        navigate('/tickets');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save ticket');
      console.error('Error saving ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Ticket' : 'Create New Ticket'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength="200"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the issue"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength="2000"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed description of the issue"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ticketCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority *
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {ticketPriorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="resourceId" className="block text-sm font-medium text-gray-700 mb-1">
                Related Resource (Optional)
              </label>
              <select
                id="resourceId"
                name="resourceId"
                value={formData.resourceId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a resource</option>
                {resources.map(resource => (
                  <option key={resource.id} value={resource.id}>
                    {resource.name} ({resource.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location (Optional)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                maxLength="200"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Where is the issue located?"
              />
            </div>
          </div>

          <div>
            <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Contact (Optional)
            </label>
            <input
              type="text"
              id="preferredContact"
              name="preferredContact"
              value={formData.preferredContact}
              onChange={handleChange}
              maxLength="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email or phone number for updates"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/tickets')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Ticket' : 'Create Ticket')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;
