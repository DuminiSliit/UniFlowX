import React, { useState, useEffect } from 'react';
import ticketService from '../../services/ticketService';
import { Search, Filter, Calendar, User, MapPin, Eye, Edit3, Trash2, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import './TicketList.css';

const TicketList = ({ setView, setSelectedTicketId, initialFilters }) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isTechnician = currentUser?.roles?.includes('ROLE_TECHNICIAN');
  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    status: initialFilters?.status || '',
    category: initialFilters?.category || '',
    priority: initialFilters?.priority || '',
    keyword: initialFilters?.keyword || '',
    assignedToId: initialFilters?.assignedToId || ''
  });

  useEffect(() => {
    fetchTickets();
  }, [currentPage, filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // Only send non-empty filters to the backend
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      const hasFilters = Object.keys(activeFilters).length > 0;
      
      const response = hasFilters 
        ? await ticketService.searchTickets(activeFilters, currentPage)
        : await ticketService.getAllTickets(currentPage);
      
      setTickets(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      setError('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(0);
  };

  return (
    <div className="ticket-list-wrapper">
      {/* Filters Section */}
      <div className="tl-filter-card">
        <div className="tl-filter-header">
          <div className="tl-filter-icon">
            <Filter className="w-5 h-5" />
          </div>
          <h2>Filter Tickets</h2>
        </div>
        
        <div className="tl-filter-grid">
          <div className="tl-search-input-group">
            <Search className="tl-search-icon w-4 h-4" />
            <input
              type="text"
              placeholder="Search by ticket title..."
              className="tl-input"
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
            />
          </div>
          <div className="tl-select-group">
            <select
              className="tl-select"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="URGENT">Urgent Priority</option>
            </select>
          </div>
          
          {isTechnician && (
            <div className="tl-toggle-group">
              <label className="tl-toggle">
                <input 
                  type="checkbox"
                  checked={filters.assignedToId === currentUser.id}
                  onChange={(e) => handleFilterChange('assignedToId', e.target.checked ? currentUser.id : '')}
                />
                <span className="tl-toggle-label">Assigned to me</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="tl-loading">
          <div className="tl-spinner" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="tl-empty-state">
          <div className="tl-empty-icon">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3>No Maintenance Tickets Yet</h3>
          <p>When you submit maintenance tickets, they will appear here. Track your facility issues in real-time.</p>
        </div>
      ) : (
        <div className="tl-grid">
          {tickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className={`tl-card priority-${ticket.priority?.toLowerCase() || 'medium'}`}
            >
              <div className="tl-card-header">
                <div className="tl-badge-group">
                  <span className="tl-badge tl-badge-priority">{ticket.priority || 'N/A'}</span>
                  <span className="tl-badge tl-badge-category">{ticket.category || 'N/A'}</span>
                </div>
                <div className={`tl-status-badge status-${ticket.status?.toLowerCase() || 'open'}`}>
                  {ticket.status?.replace('_', ' ') || 'OPEN'}
                </div>
              </div>

              <h3 
                className="tl-card-title"
                onClick={() => { setSelectedTicketId(ticket.id); setView('ticket-detail'); }}
              >
                {ticket.title}
              </h3>
              
              <p className="tl-card-desc">{ticket.description}</p>

              <div className="tl-card-meta">
                <div className="tl-meta-item">
                  <MapPin className="w-3 h-3" />
                  <span>{ticket.location || 'No Location'}</span>
                </div>
                <div className="tl-meta-item">
                  <User className="w-3 h-3" />
                  <span>{ticket.createdBy?.username || 'System'}</span>
                </div>
                <div className="tl-meta-item">
                  <Calendar className="w-3 h-3" />
                  <span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="tl-meta-item">
                  <Clock className="w-3 h-3" />
                  <span>{ticket.estimatedTime ? `${ticket.estimatedTime}h` : 'No Est.'}</span>
                </div>
              </div>

              <div className="tl-card-actions">
                <button 
                  className="tl-btn-view"
                  onClick={() => { setSelectedTicketId(ticket.id); setView('ticket-detail'); }}
                >
                  <Eye className="w-4 h-4" /> View Details
                </button>
                <button className="tl-btn-icon edit">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="tl-btn-icon delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="tl-pagination">
          <button
            className="tl-page-btn"
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="tl-page-info">
            {currentPage + 1} / {totalPages}
          </div>
          <button
            className="tl-page-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketList;
