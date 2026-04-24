import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import BookingForm from './components/BookingForm'
import BookingList from './components/BookingList'
import ResourceList from './components/ResourceList'
import ResourceForm from './components/ResourceForm'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import SmartCampusHome from './components/SmartCampusHome'
import ProtectedRoute from './components/ProtectedRoute'
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler'
import authService from './services/authService'
import { LogOut, User as UserIcon } from 'lucide-react'
import Footer from './components/Footer'
import TicketsPage from './pages/TicketsPage'
import CreateTicketPage from './pages/CreateTicketPage'
import TicketDetailPage from './pages/TicketDetailPage'

// Dashboard is defined once here
function Dashboard() {
  const location = useLocation();
  const [view, setView] = useState('resources-list')
  const [editingResource, setEditingResource] = useState(null);
  const [preselectedResourceId, setPreselectedResourceId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
  }, []);

  // Sync view state when query parameters change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('view') === 'bookings') {
      setView('list');
    } else if (params.get('view') === 'catalog' || !params.get('view')) {
      setView('resources-list');
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

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="logo-link">
          <img src="/logo.png" alt="UniFlowX Logo" className="logo-img" />
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-btn">Home</Link>
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
            {isAdmin ? 'Review Queue' : 'My Bookings'}
          </button>
          <Link to="/tickets" className="nav-btn">
            Maintenance Tickets
          </Link>
        </div>

        <div className="nav-actions">
          {currentUser && (
            <div className="nav-user">
              <div className="user-info">
                <UserIcon size={18} />
                <span>{currentUser.email}</span>
              </div>
              <button className="btn-logout" onClick={handleLogout} title="Log Out">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="main-content">
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
                {isAdmin ? 'Pending Approval Queue' : 'Your Reservations'}
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
        <Route path="/smart-campus" element={<SmartCampusHome />} />
        <Route path="/campus-home" element={<SmartCampusHome />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/auth/google/callback" element={<OAuth2RedirectHandler />} />

        {/* Protected Dashboard - requires login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/tickets/create" element={<CreateTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
        </Route>

        {/* Redirect unknown routes back to landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
