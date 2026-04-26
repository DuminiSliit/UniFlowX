import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Upload, MapPin, Plus, CheckCircle2, Clock, Calendar, Tag, User, Building, Wrench, Search, Filter, Edit2, Trash2, X } from 'lucide-react';
import './TicketingPage.css';
import ticketService from '../services/ticketService';

const TicketingPage = () => {
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      navigate('/login');
    }
  }, [navigate]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    priority: 'MEDIUM',
    category: 'EQUIPMENT',
    assignedTo: '',
    estimatedTime: '',
    attachments: []
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [editingTicket, setEditingTicket] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    location: '',
    priority: 'MEDIUM',
    category: 'EQUIPMENT'
  });

  const categories = [
    { value: 'EQUIPMENT', label: 'Equipment' },
    { value: 'FACILITY', label: 'Facility' },
    { value: 'NETWORK', label: 'Network' },
    { value: 'SOFTWARE', label: 'Software' },
    { value: 'OTHER', label: 'Other' }
  ];

  const priorities = [
    { value: 'LOW', label: 'Low', color: '#3b82f6' },
    { value: 'MEDIUM', label: 'Medium', color: '#f59e0b' },
    { value: 'HIGH', label: 'High', color: '#ef4444' },
    { value: 'URGENT', label: 'Urgent', color: '#dc2626' }
  ];

  // Filter tickets based on search and priority
  const filterTickets = () => {
    let filtered = tickets;

    // Filter by title search
    if (searchTitle.trim()) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    // Filter by priority
    if (filterPriority !== 'ALL') {
      filtered = filtered.filter(ticket => ticket.priority === filterPriority);
    }

    setFilteredTickets(filtered);
  };

  // Update filtered tickets when filters change
  useEffect(() => {
    filterTickets();
  }, [tickets, searchTitle, filterPriority]);

  // Handle edit ticket
  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setEditFormData({
      title: ticket.title,
      description: ticket.description,
      location: ticket.location,
      priority: ticket.priority,
      category: ticket.category
    });
    setEditMode(true);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingTicket(null);
    setEditMode(false);
    setEditFormData({
      title: '',
      description: '',
      location: '',
      priority: 'MEDIUM',
      category: 'EQUIPMENT'
    });
  };

  // Handle update ticket
  const handleUpdateTicket = async () => {
    if (!editingTicket) return;

    try {
      const updatedTicket = await ticketService.updateTicket(editingTicket.id, editFormData);
      
      // Update tickets list
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === editingTicket.id ? updatedTicket : ticket
        )
      );
      
      handleCancelEdit();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update ticket:', error);
      alert('Failed to update ticket. Please try again.');
    }
  };

  // Handle delete ticket
  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) {
      return;
    }

    try {
      await ticketService.deleteTicket(ticketId);
      
      // Update tickets list
      setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      alert('Failed to delete ticket. Please try again.');
    }
  };

  const locations = [
    'Lecture Hall A', 'Lecture Hall B', 'Lecture Hall C',
    'Computer Lab 1', 'Computer Lab 2', 'Computer Lab 3',
    'Library', 'Student Center', 'Cafeteria',
    'Gym', 'Sports Complex', 'Admin Building',
    'Science Building', 'Engineering Block'
  ];

  // Fetch tickets when component mounts
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const response = await ticketService.getAllTickets();
      setTickets(response.content || []);
      setFilteredTickets(response.content || []);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      // Set empty array on error to prevent infinite loading
      setTickets([]);
      setFilteredTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Ticket title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = 'Assignee is required';
    }
    
    if (!formData.estimatedTime.trim()) {
      newErrors.estimatedTime = 'Estimated time is required';
    } else if (!/^\d+$/.test(formData.estimatedTime)) {
      newErrors.estimatedTime = 'Estimated time must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      location: value
    }));
    
    if (errors.location) {
      setErrors(prev => ({
        ...prev,
        location: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Submit ticket to backend
      const ticketData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        location: formData.location,
        preferredContact: 'EMAIL'
      };
      
      await ticketService.createTicket(ticketData);
      
      // Reset form and refresh tickets
      setFormData({
        title: '',
        description: '',
        location: '',
        priority: 'MEDIUM',
        category: 'EQUIPMENT',
        assignedTo: '',
        estimatedTime: '',
        attachments: []
      });
      
      // Refresh tickets list
      await fetchTickets();
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to submit ticket:', error);
      setErrors({ submit: 'Failed to submit ticket. Please try again.' });
      // Still reset form on error to allow user to try again
      setFormData({
        title: '',
        description: '',
        location: '',
        priority: 'MEDIUM',
        category: 'EQUIPMENT',
        assignedTo: '',
        estimatedTime: '',
        attachments: []
      });
    } finally {
      setSubmitting(false);
    }
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  
  return (
    <div className="ticketing-page">
      <div className="ticketing-header">
        <button onClick={() => navigate('/')} className="btn-back">
          <ArrowLeft size={20} />
          Back to Home
        </button>
        <h1>Create Maintenance Ticket</h1>
        <p className="ticketing-subtitle">Report maintenance issues and facility problems</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="success-message">
          <CheckCircle2 size={20} />
          <span>Ticket submitted successfully! It will appear in the tickets list below.</span>
        </div>
      )}

      <div className="ticketing-container">
        {/* Left Side - All Tickets */}
        <div className="tickets-section">
          {/* Filter Section */}
          <div className="filter-section">
            <div className="filter-header">
              <Filter size={20} />
              <h3>Filter Tickets</h3>
            </div>
            <div className="filter-controls">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by ticket title..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="priority-filter">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="priority-select"
                >
                  <option value="ALL">All Priorities</option>
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {filteredTickets.length !== tickets.length && (
              <div className="filter-results">
                <span>Showing {filteredTickets.length} of {tickets.length} tickets</span>
                <button 
                  onClick={() => {
                    setSearchTitle('');
                    setFilterPriority('ALL');
                  }}
                  className="clear-filters"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
          
          {loadingTickets ? (
            <div className="loading-tickets">
              <div className="spinner"></div>
              <p>Loading tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="no-tickets">
              <Wrench size={48} className="no-tickets-icon" />
              <h3>No Maintenance Tickets Yet</h3>
              <p>When you submit maintenance tickets, they will appear here.</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="no-tickets">
              <Search size={48} className="no-tickets-icon" />
              <h3>No Tickets Found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="tickets-grid">
              {filteredTickets.map(ticket => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-header">
                    <span className={`ticket-priority priority-${ticket.priority.toLowerCase()}`}>
                      {ticket.priority}
                    </span>
                    <span className="ticket-category">{ticket.category}</span>
                  </div>
                  
                  <div className="ticket-content">
                    <h3 className="ticket-title">{ticket.title}</h3>
                    <p className="ticket-description">{ticket.description}</p>
                    
                    <div className="ticket-meta">
                      <div className="meta-item">
                        <MapPin size={16} />
                        <span>{ticket.location}</span>
                      </div>
                      <div className="meta-item">
                        <User size={16} />
                        <span>{ticket.createdBy?.email || 'Unknown'}</span>
                      </div>
                      <div className="meta-item">
                        <Calendar size={16} />
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="ticket-status">
                      <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ticket-actions">
                    <button
                      onClick={() => handleEditTicket(ticket)}
                      className="btn-edit"
                      title="Edit Ticket"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="btn-delete"
                      title="Delete Ticket"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Ticket Creation Form */}
        <div className="form-section">
          <form onSubmit={handleSubmit} className="ticketing-form">
            <div className="form-header">
              <h2><Building size={20} /> Create New Ticket</h2>
              <p>Fill in the details below to submit a maintenance request</p>
            </div>
            
            <div className="form-content">
              <div className="form-group">
                <label htmlFor="title">Ticket Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief description of the issue"
                  className={errors.title ? 'error' : ''}
                  required
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Detailed Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide detailed information about the maintenance issue"
                  rows={6}
                  className={errors.description ? 'error' : ''}
                  required
                />
                <div className="char-count">
                  {formData.description.length}/1000 characters
                </div>
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority Level *</label>
                  <div className="priority-options">
                    {priorities.map(priority => (
                      <label key={priority.value} className="priority-option">
                        <input
                          type="radio"
                          name="priority"
                          value={priority.value}
                          checked={formData.priority === priority.value}
                          onChange={handleChange}
                        />
                        <span 
                          className="priority-label"
                          style={{ backgroundColor: priority.color }}
                        >
                          {priority.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <div className="location-input-group">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleLocationChange}
                    placeholder="e.g., Lecture Hall A, Computer Lab 3"
                    className={errors.location ? 'error' : ''}
                    list="locations"
                    required
                  />
                  <datalist id="locations">
                    {locations.map((location, index) => (
                      <option key={index} value={location} />
                    ))}
                  </datalist>
                  {errors.location && <span className="error-message">{errors.location}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="assignedTo">Assigned To *</label>
                <input
                  type="text"
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  placeholder="Maintenance team member or department"
                  className={errors.assignedTo ? 'error' : ''}
                  required
                />
                {errors.assignedTo && <span className="error-message">{errors.assignedTo}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="estimatedTime">Estimated Time (hours) *</label>
                <input
                  type="number"
                  id="estimatedTime"
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleChange}
                  placeholder="Estimated time to complete"
                  min="1"
                  max="100"
                  className={errors.estimatedTime ? 'error' : ''}
                  required
                />
                {errors.estimatedTime && <span className="error-message">{errors.estimatedTime}</span>}
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                {errors.submit && (
                  <div className="error-message submit-error">
                    <AlertCircle size={18} />
                    {errors.submit}
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="spinner"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Submit Ticket
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Edit Ticket Modal */}
      {editMode && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <div className="edit-modal-header">
              <h3>Edit Ticket</h3>
              <button onClick={handleCancelEdit} className="btn-close-modal">
                <X size={20} />
              </button>
            </div>
            
            <div className="edit-modal-body">
              <div className="form-group">
                <label>Ticket Title</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  placeholder="Enter ticket title"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  placeholder="Describe the issue"
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({...editFormData, priority: e.target.value})}
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="edit-modal-footer">
              <button onClick={handleCancelEdit} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleUpdateTicket} className="btn-update">
                Update Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketingPage;
