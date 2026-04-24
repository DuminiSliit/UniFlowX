import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import TicketComments from './TicketComments';
import AttachmentUpload from './AttachmentUpload';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [statusData, setStatusData] = useState({ status: '', reason: '' });
  const [assignData, setAssignData] = useState({ assignedToId: '' });

  const ticketStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];
  const users = [
    { id: 1, username: 'admin', email: 'admin@campus.edu' },
    { id: 2, username: 'technician1', email: 'tech1@campus.edu' }
  ];

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicketById(id);
      setTicket(data);
    } catch (err) {
      setError('Failed to fetch ticket details');
      console.error('Error fetching ticket:', err);
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
      console.error('Error updating status:', err);
    }
  };

  const handleAssignTicket = async () => {
    try {
      await ticketService.assignTicket(id, assignData);
      setShowAssignModal(false);
      setAssignData({ assignedToId: '' });
      fetchTicket();
    } catch (err) {
      setError('Failed to assign ticket');
      console.error('Error assigning ticket:', err);
    }
  };

  const handleDeleteTicket = async () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await ticketService.deleteTicket(id);
        navigate('/tickets');
      } catch (err) {
        setError('Failed to delete ticket');
        console.error('Error deleting ticket:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Ticket not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">#{ticket.id} - {ticket.title}</h1>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ')}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                {ticket.category}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowStatusUpdate(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Status
            </button>
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Assign
            </button>
            <button
              onClick={handleDeleteTicket}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
              </div>

              {ticket.resource && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Related Resource</h2>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-900">{ticket.resource.name}</p>
                    <p className="text-sm text-gray-600">{ticket.resource.type}</p>
                  </div>
                </div>
              )}

              {ticket.location && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Location</h2>
                  <p className="text-gray-700">{ticket.location}</p>
                </div>
              )}

              {ticket.preferredContact && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Preferred Contact</h2>
                  <p className="text-gray-700">{ticket.preferredContact}</p>
                </div>
              )}

              <AttachmentUpload ticketId={ticket.id} attachments={ticket.attachments} />
              <TicketComments ticketId={ticket.id} />
            </div>
          </div>

          <div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Created By</p>
                  <p className="text-sm text-gray-900">{ticket.createdBy?.username || 'Unknown'}</p>
                  <p className="text-xs text-gray-600">{ticket.createdBy?.email}</p>
                </div>
                {ticket.assignedTo && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Assigned To</p>
                    <p className="text-sm text-gray-900">{ticket.assignedTo.username}</p>
                    <p className="text-xs text-gray-600">{ticket.assignedTo.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p className="text-sm text-gray-900">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-900">
                    {new Date(ticket.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Ticket Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                <select
                  value={statusData.status}
                  onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select status</option>
                  {ticketStatuses.map(status => (
                    <option key={status} value={status}>{status.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
                <textarea
                  value={statusData.reason}
                  onChange={(e) => setStatusData({ ...statusData, reason: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Reason for status change"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowStatusUpdate(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Ticket</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                <select
                  value={assignData.assignedToId}
                  onChange={(e) => setAssignData({ ...assignData, assignedToId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select user</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTicket}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetail;
