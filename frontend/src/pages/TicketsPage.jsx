import React from 'react';
import TicketList from '../components/ticket/TicketList';
import TicketForm from '../components/ticket/TicketForm';
import ErrorBoundary from '../components/ErrorBoundary';
import { ArrowLeft, Plus } from 'lucide-react';
import '../components/ticket/TicketsPage.css';

const TicketsPage = ({ setView, setSelectedTicketId, initialFilters }) => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isTechnician = currentUser?.roles?.includes('ROLE_TECHNICIAN');
  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');
  const isStaffOrAdmin = isTechnician || isAdmin;

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="tickets-page-container">
      {/* Premium Header */}
      <div className="tp-premium-header">
        <div className="tp-header-card">
          <button 
            onClick={() => setView('overview')}
            className="tp-back-btn"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="tp-title">
            {isStaffOrAdmin ? 'Maintenance Operations' : 'Create Maintenance Ticket'}
          </h1>
          <p className="tp-subtitle">
            {isStaffOrAdmin ? 'Manage your assigned tasks and update resolution progress' : 'Report maintenance issues and facility problems'}
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className={`tp-content-grid ${isStaffOrAdmin ? 'technician-view' : ''}`}>
        <div className="tp-list-section">
          <TicketList 
            key={refreshKey}
            setView={setView} 
            setSelectedTicketId={setSelectedTicketId} 
            initialFilters={initialFilters}
          />
        </div>
        
        {!isStaffOrAdmin && (
          <div className="tp-form-sidebar">
            <div className="tp-sidebar-card">
              <div className="tp-sidebar-header">
                <div className="tp-sidebar-icon-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                </div>
                <div>
                  <h2 className="tp-sidebar-title">Create New Ticket</h2>
                  <p className="tp-sidebar-subtitle">Fill in the details below to submit a maintenance request</p>
                </div>
              </div>
              
              <TicketForm 
                isEdit={false} 
                onSuccess={handleSuccess}
                onCancel={() => {}} 
                standalone={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TicketsPageWithBoundary = (props) => (
  <ErrorBoundary>
    <TicketsPage {...props} />
  </ErrorBoundary>
);

export default TicketsPageWithBoundary;
