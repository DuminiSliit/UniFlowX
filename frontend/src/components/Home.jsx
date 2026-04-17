import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Calendar,
    Building2,
    AlertTriangle,
    Bell,
    User,
    ShieldCheck,
    LogIn,
    LogOut,
    Search,
    MousePointer2,
    CheckCircle2,
    ChevronRight
} from 'lucide-react';
import './Home.css';
import authService from '../services/authService';
import Footer from './Footer';

const Home = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        setCurrentUser(authService.getCurrentUser());
    }, []);

    const handleLogout = () => {
        authService.logout();
        window.location.reload(); // Refresh to clear state everywhere
    };

    return (
        <div className="home-container">
            {/* Navigation Bar */}
            <nav className="home-nav">
                <Link to="/" className="logo-link">
                    <img src="/logo.png" alt="UniFlowX Logo" className="logo-img" />
                </Link>
                <div className="nav-menu">
                    <Link to="/" className="nav-menu-link active">Home</Link>
                    <Link to="/dashboard" className="nav-menu-link">Facilities Catalogue</Link>
                    <Link to="/dashboard?view=bookings" className="nav-menu-link">My Bookings</Link>
                </div>

                <div className="home-nav-actions">
                    {currentUser ? (
                        <div className="nav-user">
                            <div className="user-info">
                                <User size={18} />
                                <span>{currentUser.email}</span>
                            </div>
                            <button className="btn-logout" onClick={handleLogout} title="Log Out">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn-primary btn-sm">Sign Up</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    <span className="badge-new">Version 2.0 Live ✨</span>
                    <h1>UniFlowX</h1>
                    <p className="hero-subtitle">
                        Smart Campus Operations, Simplified.
                    </p>
                    <p className="hero-description">
                        A centralized platform to book facilities, manage campus resources, and handle 
                        maintenance requests efficiently. Access UniFlowX using your Google account 
                        or secure email login.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn-primary lg" onClick={() => navigate('/login')}>
                            Get Started <LogIn size={20} />
                        </button>
                        <button className="btn-secondary lg" onClick={() => navigate('/dashboard')}>
                            Explore Facilities <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="hero-image-wrapper">
                        <img src="/hero-students.jpg" alt="Students using UniFlowX" className="hero-main-img" />
                        <div className="hero-image-overlay"></div>
                        <div className="floating-stat stat-1">
                            <span className="dot"></span> 24/7 Access
                        </div>
                        <div className="floating-stat stat-2">
                            <span className="dot"></span> Smart Booking
                        </div>
                    </div>
                </div>
            </header>

            {/* Key Features Section */}
            <section className="section features">
                <div className="section-header">
                    <h2 className="section-title">What You Can Do</h2>
                    <p>Powerful tools to help you manage your campus experience.</p>
                </div>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <Calendar size={28} />
                        </div>
                        <h3>Smart Booking System</h3>
                        <p>Reserve lecture halls, labs, and equipment easily. Avoid conflicts with real-time availability checking.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <Building2 size={28} />
                        </div>
                        <h3>Facility Management</h3>
                        <p>Browse and filter resources by type, capacity, and location. Get all the details you need before booking.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <AlertTriangle size={28} />
                        </div>
                        <h3>Incident Reporting</h3>
                        <p>Report maintenance issues instantly with images and track their resolution progress in real-time.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <Bell size={28} />
                        </div>
                        <h3>Real-Time Notifications</h3>
                        <p>Stay updated with instant notifications about booking approvals, ticket updates, and comments.</p>
                    </div>
                </div>
            </section>

            {/* Role-Based Section */}
            <section className="section roles">
                <div className="section-header">
                    <h2 className="section-title">Designed for Everyone</h2>
                </div>
                <div className="roles-container">
                    <div className="role-box">
                        <div className="role-header">
                            <User size={32} className="role-icon" />
                            <h3>Students & Staff</h3>
                        </div>
                        <ul>
                            <li>Discover and book campus resources</li>
                            <li>Report facility issues instantly</li>
                            <li>Track your personal requests history</li>
                        </ul>
                    </div>
                    <div className="role-box admin">
                        <div className="role-header">
                            <ShieldCheck size={32} className="role-icon" />
                            <h3>Administrators</h3>
                        </div>
                        <ul>
                            <li>Manage global resource catalogue</li>
                            <li>Approve or reject booking requests</li>
                            <li>Oversee campus-wide operations</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="section workflow">
                <div className="section-header">
                    <h2 className="section-title">How It Works</h2>
                </div>
                <div className="workflow-steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h4>Secure Login</h4>
                        <p>Access UniFlowX using your Google account or sign in with your email and password for a secure and flexible login experience.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h4>Make a Request</h4>
                        <p>Book a facility such as a lecture hall or lab, or report an incident by providing necessary details and attachments.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h4>Admin & Staff Processing</h4>
                        <p>Booking requests are reviewed by administrators, while incident tickets are assigned to technicians for resolution.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">4</div>
                        <h4>Track & Stay Updated</h4>
                        <p>Monitor the status of your bookings and tickets in real time, with notifications for every important update.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
