import React, { useState, useEffect } from 'react';
import './SmartCampusHome.css';

const SmartCampusHome = () => {
  const [userStatus, setUserStatus] = useState({
    authenticated: true,
    loginMethod: 'Google OAuth2',
    loginTime: new Date().toLocaleString()
  });

  const [campusStats, setCampusStats] = useState({
    activeCourses: 12,
    totalStudents: 2847,
    availableFacilities: 45,
    todayBookings: 23
  });

  const [systemStatus, setSystemStatus] = useState([
    { name: 'Backend API', status: 'operational' },
    { name: 'Database', status: 'connected' },
    { name: 'Authentication', status: 'active' },
    { name: 'OAuth2', status: 'configured' },
    { name: 'Security', status: 'enabled' }
  ]);

  const features = [
    { icon: '📚', title: 'Course Management', description: 'Manage your courses, assignments, and grades' },
    { icon: '🏛️', title: 'Facility Booking System', description: 'Book campus facilities and study rooms' },
    { icon: '📅', title: 'Smart Calendar Integration', description: 'Sync your academic schedule with personal calendar' },
    { icon: '👥', title: 'Student Collaboration', description: 'Connect with peers for study groups and projects' },
    { icon: '📊', title: 'Analytics Dashboard', description: 'Track your academic progress and performance' },
    { icon: '🔔', title: 'Real-time Notifications', description: 'Stay updated with important announcements' }
  ];

  const apiEndpoints = {
    authentication: [
      { method: 'POST', endpoint: '/api/auth/signin', description: 'User login' },
      { method: 'POST', endpoint: '/api/auth/signup', description: 'User registration' },
      { method: 'GET', endpoint: '/oauth2/authorization/google', description: 'Google OAuth2 login' }
    ],
    resources: [
      { method: 'GET', endpoint: '/api/resources', description: 'List all resources' },
      { method: 'GET', endpoint: '/api/resources/{id}', description: 'Get specific resource' },
      { method: 'POST', endpoint: '/api/resources', description: 'Create new resource' }
    ],
    bookings: [
      { method: 'GET', endpoint: '/api/bookings', description: 'List all bookings' },
      { method: 'GET', endpoint: '/api/bookings/my', description: 'My bookings' },
      { method: 'POST', endpoint: '/api/bookings', description: 'Create booking' },
      { method: 'PUT', endpoint: '/api/bookings/{id}', description: 'Update booking' }
    ]
  };

  const quickActions = [
    { icon: '📖', title: 'View Courses', endpoint: '/api/courses' },
    { icon: '🏛️', title: 'Browse Facilities', endpoint: '/api/resources' },
    { icon: '📅', title: 'My Bookings', endpoint: '/api/bookings/my' },
    { icon: '👤', title: 'My Profile', endpoint: '/api/user/profile' }
  ];

  return (
    <div className="smart-campus-home">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <h1 className="campus-title">
            🏫 Welcome to UniFlowX Smart Campus 🏫
          </h1>
          <p className="campus-subtitle">Empowering Education Through Technology</p>
        </div>
      </header>

      {/* User Status Card */}
      <section className="user-status-section">
        <div className="status-card">
          <h2>👤 User Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <span className="status-label">Authentication:</span>
              <span className="status-value authenticated">✅ Authenticated</span>
            </div>
            <div className="status-item">
              <span className="status-label">Login Method:</span>
              <span className="status-value">🔐 {userStatus.loginMethod}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Login Time:</span>
              <span className="status-value">⏰ {userStatus.loginTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Overview */}
      <section className="campus-overview">
        <h2>📊 Campus Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-number">{campusStats.activeCourses}</div>
            <div className="stat-label">Active Courses</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-number">{campusStats.totalStudents.toLocaleString()}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏛️</div>
            <div className="stat-number">{campusStats.availableFacilities}</div>
            <div className="stat-label">Available Facilities</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-number">{campusStats.todayBookings}</div>
            <div className="stat-label">Today's Bookings</div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>🚀 Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <button key={index} className="action-card">
              <span className="action-icon">{action.icon}</span>
              <span className="action-title">{action.title}</span>
              <span className="action-endpoint">{action.endpoint}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2>✨ Available Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API Endpoints */}
      <section className="api-section">
        <h2>🔗 Available API Endpoints</h2>
        <div className="api-categories">
          <div className="api-category">
            <h3>Authentication</h3>
            <div className="api-endpoints">
              {apiEndpoints.authentication.map((endpoint, index) => (
                <div key={index} className="api-endpoint">
                  <span className="method-badge post">{endpoint.method}</span>
                  <span className="endpoint-path">{endpoint.endpoint}</span>
                  <span className="endpoint-desc">{endpoint.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="api-category">
            <h3>Resources</h3>
            <div className="api-endpoints">
              {apiEndpoints.resources.map((endpoint, index) => (
                <div key={index} className="api-endpoint">
                  <span className={`method-badge ${endpoint.method.toLowerCase()}`}>{endpoint.method}</span>
                  <span className="endpoint-path">{endpoint.endpoint}</span>
                  <span className="endpoint-desc">{endpoint.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="api-category">
            <h3>Bookings</h3>
            <div className="api-endpoints">
              {apiEndpoints.bookings.map((endpoint, index) => (
                <div key={index} className="api-endpoint">
                  <span className={`method-badge ${endpoint.method.toLowerCase()}`}>{endpoint.method}</span>
                  <span className="endpoint-path">{endpoint.endpoint}</span>
                  <span className="endpoint-desc">{endpoint.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* System Status */}
      <section className="system-status">
        <h2>⚙️ System Status</h2>
        <div className="status-grid">
          {systemStatus.map((system, index) => (
            <div key={index} className="system-item">
              <div className={`status-indicator ${system.status}`}></div>
              <span className="system-name">{system.name}</span>
              <span className={`system-status-text ${system.status}`}>
                {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Help & Support */}
      <section className="support-section">
        <h2>📞 Help & Support</h2>
        <div className="support-grid">
          <div className="support-item">
            <span className="support-icon">📧</span>
            <div className="support-info">
              <h3>Support Email</h3>
              <p>support@uniflowx.edu</p>
            </div>
          </div>
          <div className="support-item">
            <span className="support-icon">📱</span>
            <div className="support-info">
              <h3>Help Desk</h3>
              <p>+1-234-567-8900</p>
            </div>
          </div>
          <div className="support-item">
            <span className="support-icon">📖</span>
            <div className="support-info">
              <h3>Documentation</h3>
              <p>/docs/api</p>
            </div>
          </div>
          <div className="support-item">
            <span className="support-icon">🐛</span>
            <div className="support-info">
              <h3>Report Issues</h3>
              <p>/api/feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>🎓 Thank you for using UniFlowX Smart Campus!</p>
        <p>🌟 Empowering Education Through Technology</p>
      </footer>
    </div>
  );
};

export default SmartCampusHome;
