import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
import BookingForm from './components/BookingForm'
import BookingList from './components/BookingList'
import ResourceList from './components/ResourceList'
import ResourceForm from './components/ResourceForm'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler'
import authService from './services/authService'
import UserProfile from './components/UserProfile'
import DashboardOverview from './components/DashboardOverview'
import { LogOut, User as UserIcon, Settings } from 'lucide-react'
import Footer from './components/Footer'
import TicketsPage from './pages/TicketsPage'
import CreateTicketPage from './pages/CreateTicketPage'
import TicketDetailPage from './pages/TicketDetailPage'

// Dashboard is defined once here
function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const urlViewMap = {
      'bookings': 'list',
      'profile': 'profile',
      'catalog': 'resources-list',
      'tickets': 'tickets',
      'create-ticket': 'create-ticket',
      'ticket-detail': 'ticket-detail',
      'overview': 'overview'
    };
    return urlViewMap[viewParam] || 'overview';
  })
  const [editingResource, setEditingResource] = useState(null);
  const [preselectedResourceId, setPreselectedResourceId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  });
  const [initialTicketFilters, setInitialTicketFilters] = useState({});

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
  }, []);

  // Update URL when view changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentView = params.get('view');
    
    // Map internal view names to URL params if different
    const urlViewMap = {
      'list': 'bookings',
      'profile': 'profile',
      'resources-list': 'catalog',
      'tickets': 'tickets',
      'create-ticket': 'create-ticket',
      'overview': 'overview',
      'ticket-detail': 'ticket-detail'
    };

    const targetUrlView = urlViewMap[view] || view;
    let url = `/dashboard?view=${targetUrlView}`;
    
    if (view === 'ticket-detail' && selectedTicketId) {
      url += `&id=${selectedTicketId}`;
    }

    if (location.search !== `?${url.split('?')[1]}`) {
      navigate(url, { replace: true });
    }
  }, [view, selectedTicketId, navigate, location.search]);

  // Sync view state when query parameters change (for initial load/direct links)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get('view');
    const idParam = params.get('id');

    if (idParam) {
      setSelectedTicketId(idParam);
    }

    if (viewParam === 'bookings') {
      setView('list');
    } else if (viewParam === 'profile') {
      setView('profile');
    } else if (viewParam === 'catalog') {
      setView('resources-list');
    } else if (viewParam === 'tickets') {
      setView('tickets');
    } else if (viewParam === 'create-ticket') {
      setView('create-ticket');
    } else if (viewParam === 'ticket-detail') {
      setView('ticket-detail');
    } else if (viewParam === 'overview' || !viewParam) {
      setView('overview');
    }
  }, [location.search]);

  const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setView('resource-form');
  };

  const handleBookResource = (resource) => {
    setPreselectedResourceId(resource.id);
    setView('form');
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/'; // Hard redirect to Landing
  };

  // If on overview, render full-page dashboard (has its own sidebar/topbar)
  if (view === 'overview') {
    return (
      <DashboardOverview 
        setView={setView} 
        isAdmin={isAdmin} 
        setInitialTicketFilters={setInitialTicketFilters} 
      />
    );
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="logo-link">
          <img src="/logo.png" alt="UniFlowX Logo" className="logo-img" />
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-btn">Home</Link>
          <button
            className={view === 'overview' ? 'active' : ''}
            onClick={() => setView('overview')}
          >
            Dashboard
          </button>
          <button
            className={view === 'resources-list' || view === 'resource-form' ? 'active' : ''}
            onClick={() => setView('resources-list')}
          >
            Facilities Catalogue
          </button>
          <button
            className={view === 'list' || view === 'form' ? 'active' : ''}
            onClick={() => setView('list')}
          >
            {isAdmin ? 'Booking Review Queue' : 'My Bookings'}
          </button>
          <button
            className={view === 'tickets' || view === 'create-ticket' || view === 'ticket-detail' ? 'active' : ''}
            onClick={() => { setSelectedTicketId(null); setView('tickets'); }}
          >
            Incident Tickets
          </button>
        </div>

        <div className="nav-actions">
          {currentUser && (
            <div className="nav-user">
              <div className="user-info" onClick={() => setShowDropdown(!showDropdown)} style={{cursor: 'pointer'}}>
                <UserIcon size={18} />
                <span>{currentUser.email}</span>
              </div>
              
              {showDropdown && (
                <div className="user-dropdown">
                  <button 
                    className="user-dropdown-item" 
                    onClick={() => {
                      setView('profile');
                      setShowDropdown(false);
                    }}
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <button className="user-dropdown-item text-danger" onClick={handleLogout}>
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <main className={`main-content ${(view === 'tickets' || view === 'create-ticket' || view === 'ticket-detail') ? 'full-width-view' : ''}`}>
        {view === 'overview' && (
          <DashboardOverview 
            setView={setView} 
            isAdmin={isAdmin} 
            setInitialTicketFilters={setInitialTicketFilters} 
          />
        )}

        {view === 'form' && (
          <BookingForm
            onSuccess={() => setView('list')}
            preselectedResourceId={preselectedResourceId}
          />
        )}

        {view === 'list' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="card-title" style={{ margin: 0 }}>
                {isAdmin ? 'Booking Review Queue' : 'Your Reservations'}
              </h2>
              {!isAdmin && (
                <button className="btn-primary" onClick={() => setView('form')}>+ New Booking</button>
              )}
            </div>
            <BookingList isAdmin={isAdmin} />
          </div>
        )}

        {view === 'resources-list' && (
          <div>
            {isAdmin && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button className="btn-primary" onClick={() => { setEditingResource(null); setView('resource-form'); }}>+ Add New Facility/Asset</button>
              </div>
            )}
            <ResourceList onEdit={handleEditResource} onBook={handleBookResource} isAdmin={isAdmin} />
          </div>
        )}

        {view === 'resource-form' && (
          <ResourceForm
            onSuccess={() => setView('resources-list')}
            onCancel={() => setView('resources-list')}
            editingResource={editingResource}
          />
        )}

        {view === 'profile' && (
          <UserProfile />
        )}

        {view === 'tickets' && (
          <TicketsPage 
            setView={setView} 
            setSelectedTicketId={setSelectedTicketId} 
            initialFilters={initialTicketFilters}
          />
        )}

        {view === 'create-ticket' && (
          <CreateTicketPage onSuccess={() => setView('tickets')} onCancel={() => setView('tickets')} />
        )}

        {view === 'ticket-detail' && (
          <TicketDetailPage 
            id={selectedTicketId} 
            setView={setView} 
            onBack={() => { setView('tickets'); setSelectedTicketId(null); }} 
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Log for debugging
    console.log("Current User in App:", user);
    setReady(true);
  }, [user]);

  if (!ready) return null;

  return (
    <Router>
      <Routes>
        {/* LANDING PAGE - Always visible at / and /home */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

        {/* Protected Dashboard - requires login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Redirect unknown routes back to landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
