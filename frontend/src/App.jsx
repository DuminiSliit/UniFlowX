<<<<<<< Updated upstream
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
=======
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
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
import { LogOut, User as UserIcon } from 'lucide-react'
import Footer from './components/Footer'

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
            {isAdmin ? 'Booking Review Queue' : 'My Bookings'}
          </button>
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
>>>>>>> Stashed changes

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
