import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import { userService } from '../../services/api';
import TicketComments from './TicketComments';
import AttachmentUpload from './AttachmentUpload';
import { 
  ArrowLeft, Clock, MapPin, User, Calendar, 
  AlertCircle, CheckCircle2, ChevronRight, 
  Trash2, Edit3, Settings, ShieldAlert,
  Image as ImageIcon, Download
} from 'lucide-react';
import './TicketDetail.css';
import './AttachmentUpload.css';
import './TicketComments.css';

const TicketDetail = ({ id: propId, onBack }) => {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const navigate = useNavigate();
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [statusData, setStatusData] = useState({ status: '', reason: '' });
  
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [assignedToId, setAssignedToId] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isStaffOrAdmin = currentUser?.roles?.some(r => r === 'ROLE_ADMIN' || r === 'ROLE_TECHNICIAN');
  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

  const ticketStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

  useEffect(() => {
    fetchTicket();
    if (isAdmin) {
      fetchTechnicians();
    }
  }, [id, isAdmin]);

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
      setLoading(true);
      const data = await ticketService.getTicketById(id);
      setTicket(data);
    } catch (err) {
      setError('Failed to fetch ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await ticketService.updateTicketStatus(id, statusData);
      setShowStatusUpdate(false);
      setStatusData({ status: '', reason: '' });
      fetchTicket();
    } catch (err) {
      setError('Failed to update ticket status');
    }
  };

  const handleAssignTechnician = async () => {
    try {
      await ticketService.assignTicket(id, { assignedToId });
      setShowAssignModal(false);
      setAssignedToId('');
      fetchTicket();
    } catch (err) {
      setError('Failed to assign technician');
    }
  };

  const handleDeleteTicket = async () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await ticketService.deleteTicket(id);
        if (onBack) onBack();
        else navigate('/dashboard?view=tickets');
      } catch (err) {
        setError('Failed to delete ticket');
      }
    }
  };

  if (loading) return <div className="td-loading">Loading ticket details...</div>;
  if (!ticket) return <div className="td-error">Ticket not found</div>;

  return (
    <div className="td-container">
      {/* Header Card */}
      <div className="td-header-card">
        <div className="td-title-section">
          <button onClick={onBack || (() => navigate(-1))} className="tp-back-btn">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1>Ticket #{ticket.id}: {ticket.title}</h1>
          <div className="td-badge-row">
            <span className={`tl-status-badge status-${ticket.status.toLowerCase()}`}>
              {ticket.status.replace('_', ' ')}
            </span>
            <span className={`tl-badge tl-badge-priority priority-${ticket.priority.toLowerCase()}`}>
              {ticket.priority} Priority
            </span>
          </div>
        </div>

        <div className="td-actions">
          {isAdmin && (
            <button onClick={() => setShowAssignModal(true)} className="td-btn td-btn-primary">
              <User className="w-4 h-4" /> Assign Tech
            </button>
          )}
          {isStaffOrAdmin && (
            <button onClick={() => setShowStatusUpdate(true)} className="td-btn td-btn-primary">
              <Settings className="w-4 h-4" /> Update Status
            </button>
          )}
          <button onClick={handleDeleteTicket} className="td-btn td-btn-danger">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div className="td-main-grid">
        {/* Left Column: Content */}
        <div className="td-left-col">
          <div className="td-card td-section">
            <h2><AlertCircle className="w-5 h-5 text-indigo-600" /> Description</h2>
            <div className="td-description">{ticket.description}</div>
          </div>

          {ticket.resolutionNotes && (
            <div className="td-card td-section resolution-highlight">
              <h2><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Resolution Notes</h2>
              <div className="td-description">{ticket.resolutionNotes}</div>
            </div>
          )}

          {/* Attachments Section */}
          <div className="td-card td-section">
            <AttachmentUpload 
              ticketId={ticket.id} 
              attachments={ticket.attachments} 
              onUpdate={fetchTicket} 
            />
          </div>

          {/* Comments Section */}
          <div className="td-card">
            <TicketComments ticketId={ticket.id} />
          </div>
        </div>

        {/* Right Column: Metadata */}
        <div className="td-right-col">
          <div className="td-card">
            <h2><ShieldAlert className="w-5 h-5 text-indigo-600" /> Information</h2>
            <div className="td-info-box">
              <div className="td-info-item">
                <span className="td-info-label">Created By</span>
                <span className="td-info-value">{ticket.createdBy?.username}</span>
              </div>
              <div className="td-info-item">
                <span className="td-info-label">Location</span>
                <span className="td-info-value">{ticket.location || 'Not Specified'}</span>
              </div>
              <div className="td-info-item">
                <span className="td-info-label">Technician Assigned</span>
                <span className="td-info-value">{ticket.assignedTo?.username || 'Unassigned'}</span>
              </div>
              <div className="td-info-item">
                <span className="td-info-label">Estimated Time</span>
                <span className="td-info-value">{ticket.estimatedTime ? `${ticket.estimatedTime} Hours` : 'TBD'}</span>
              </div>
              <div className="td-info-item">
                <span className="td-info-label">Submitted On</span>
                <span className="td-info-value">{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusUpdate && (
        <div className="td-modal-overlay" onClick={() => setShowStatusUpdate(false)}>
          <div className="td-modal" onClick={e => e.stopPropagation()}>
            <h3>Update Workflow Status</h3>
            <div className="tf-group mb-4">
              <label className="tf-label">Select New Status</label>
              <select 
                className="tf-select"
                value={statusData.status}
                onChange={e => setStatusData({...statusData, status: e.target.value})}
              >
                <option value="">Choose status...</option>
                {ticketStatuses.map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div className="tf-group mb-6">
              <label className="tf-label">Resolution/Reason Note</label>
              <textarea 
                className="tf-textarea"
                rows="4"
                placeholder="Add technical notes or reason for status change..."
                value={statusData.reason}
                onChange={e => setStatusData({...statusData, reason: e.target.value})}
              />
            </div>
            <div className="td-actions">
              <button onClick={() => setShowStatusUpdate(false)} className="td-btn td-btn-secondary">Cancel</button>
              <button onClick={handleStatusUpdate} className="td-btn td-btn-success">Confirm Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Technician Modal */}
      {showAssignModal && (
        <div className="td-modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="td-modal" onClick={e => e.stopPropagation()}>
            <h3>Assign Technician</h3>
            <div className="tf-group mb-6">
              <label className="tf-label">Select Technician</label>
              <select 
                className="tf-select"
                value={assignedToId}
                onChange={e => setAssignedToId(e.target.value)}
              >
                <option value="">Choose technician...</option>
                {technicians.map(tech => (
                  <option key={tech.id} value={tech.id}>{tech.fullName || tech.username}</option>
                ))}
              </select>
            </div>
            <div className="td-actions">
              <button onClick={() => setShowAssignModal(false)} className="td-btn td-btn-secondary">Cancel</button>
              <button onClick={handleAssignTechnician} className="td-btn td-btn-success" disabled={!assignedToId}>Assign Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetail;
