import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import { userService } from '../../services/api';
import { Plus, AlertCircle, Clock, User, MapPin, X, Camera } from 'lucide-react';
import './TicketForm.css';

const TicketForm = ({ ticketId, isEdit = false, onSuccess, onCancel, standalone = true }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'OTHER',
    priority: 'MEDIUM',
    resourceId: '',
    location: '',
    preferredContact: '',
    assignedToId: '',
    estimatedTime: ''
  });

  const ticketCategories = ['EQUIPMENT', 'FACILITY', 'NETWORK', 'SOFTWARE', 'OTHER'];
  const ticketPriorities = [
    { value: 'LOW', label: 'Low', color: '#10b981' },
    { value: 'MEDIUM', label: 'Medium', color: '#f59e0b' },
    { value: 'HIGH', label: 'High', color: '#f43f5e' },
    { value: 'URGENT', label: 'Urgent', color: '#be123c' }
  ];

  useEffect(() => {
    fetchTechnicians();
    if (isEdit && ticketId) {
      fetchTicket();
    }
  }, [ticketId, isEdit]);

  const fetchTechnicians = async () => {
    try {
      const res = await userService.getTechnicians();
      setTechnicians(res.data || []);
    } catch (err) {
      console.error('Error fetching technicians:', err);
    }
  };

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
        preferredContact: ticket.preferredContact || '',
        assignedToId: ticket.assignedTo?.id || '',
        estimatedTime: ticket.estimatedTime || ''
      });
    } catch (err) {
      setError('Failed to fetch ticket details');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      setError('You can only upload up to 3 images');
      return;
    }
    setImages(prev => [...prev, ...files]);
    setError('');
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      if (isEdit) {
        result = await ticketService.updateTicket(ticketId, formData);
        setSuccess('Ticket updated successfully');
      } else {
        result = await ticketService.createTicket(formData);
        
        // Handle attachments if any
        if (images.length > 0) {
          for (const image of images) {
            await ticketService.uploadAttachment(result.id, image);
          }
        }
        
        setSuccess('Ticket created successfully');
      }

      setTimeout(() => {
        if (onSuccess) onSuccess();
        else navigate('/dashboard?view=tickets');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save ticket');
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="tf-form">
      <div className="tf-group">
        <label className="tf-label">Ticket Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Brief description of the issue"
          className="tf-input"
        />
      </div>

      <div className="tf-group">
        <label className="tf-label">Detailed Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="3"
          placeholder="Provide detailed information..."
          className="tf-textarea"
        />
      </div>

      <div className="tf-group">
        <label className="tf-label">Category *</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="tf-select"
        >
          {ticketCategories.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</option>
          ))}
        </select>
      </div>

      <div className="tf-group">
        <label className="tf-label">Priority Level *</label>
        <div className="tf-priority-grid">
          {ticketPriorities.map((p) => (
            <label key={p.value} className="tf-priority-item">
              <input
                type="radio"
                name="priority"
                value={p.value}
                checked={formData.priority === p.value}
                onChange={() => setFormData(prev => ({ ...prev, priority: p.value }))}
                className="tf-priority-radio"
              />
              <span className={`tf-priority-pill ${p.value}`}>
                {p.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="tf-group">
        <label className="tf-label">Location *</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          placeholder="e.g., Lecture Hall A, Computer Lab 3"
          className="tf-input"
        />
      </div>

      <div className="tf-group">
        <label className="tf-label">Attachments (Max 3)</label>
        <div className="tf-image-upload-zone">
          <input
            type="file"
            id="ticket-images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            disabled={images.length >= 3}
            className="tf-file-input"
          />
          <label htmlFor="ticket-images" className="tf-upload-btn">
            <Camera className="w-4 h-4" /> Add Images
          </label>
          <div className="tf-image-previews">
            {images.map((img, index) => (
              <div key={index} className="tf-img-preview">
                <span>{img.name}</span>
                <button type="button" onClick={() => removeImage(index)}><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tf-group">
        <label className="tf-label">Assigned To *</label>
        <select
          name="assignedToId"
          value={formData.assignedToId}
          onChange={handleChange}
          className="tf-select"
        >
          <option value="">Maintenance team member or department</option>
          {technicians.map(tech => (
            <option key={tech.id} value={tech.id}>{tech.fullName || tech.username}</option>
          ))}
        </select>
      </div>

      <div className="tf-group">
        <label className="tf-label">Estimated Time (hours) *</label>
        <input
          type="number"
          name="estimatedTime"
          value={formData.estimatedTime}
          onChange={handleChange}
          placeholder="Estimated time to complete"
          className="tf-input"
        />
      </div>

      {error && <div className="tf-error"><AlertCircle className="w-4 h-4" /> {error}</div>}
      {success && <div className="tf-success"><Plus className="w-4 h-4" /> {success}</div>}

      <div className="tf-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="tf-cancel-btn">
            Cancel
          </button>
        )}
        <button type="submit" disabled={loading} className="tf-submit-btn">
          {loading ? <div className="tf-loader" /> : <><Plus className="w-5 h-5" /> {isEdit ? 'Update Ticket' : 'Submit Ticket'}</>}
        </button>
      </div>
    </form>
  );

  if (standalone) {
    return (
      <div className="tf-standalone-container">
        <div className="tf-standalone-card">
          <h1>{isEdit ? 'Edit Ticket' : 'Create Maintenance Ticket'}</h1>
          {formContent}
        </div>
      </div>
    );
  }

  return formContent;
};

export default TicketForm;
