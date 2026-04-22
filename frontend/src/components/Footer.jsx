import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const Footer = () => {
    const currentUser = authService.getCurrentUser();
    const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

    return (
        <footer className="footer-container">
            <div className="footer-grid">
                {/* Left Section: Branding */}
                <div className="footer-section branding">
                    <img src="/logo.png" alt="UniFlowX Logo" className="footer-logo-img" />
                    <h4 className="footer-tagline">Smart Campus Operations, Simplified.</h4>
                    <p className="footer-desc">
                        A centralized platform for booking facilities and managing campus operations efficiently.
                    </p>
                </div>

                {/* Middle Section: Quick Links */}
                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/dashboard">Facilities Catalogue</Link></li>
                        <li><Link to="/dashboard?view=bookings">
                            {isAdmin ? 'Booking Review Queue' : 'My Bookings'}
                        </Link></li>
                        <li><Link to="#">Report Issue</Link></li>
                    </ul>
                </div>

                {/* Right Section: Contact */}
                <div className="footer-section contact">
                    <h3>Contact / Info</h3>
                    <ul>
                        <li><strong>📧</strong> support@uniflowx.com</li>
                        <li><strong>📍</strong> SLIIT – Faculty of Computing</li>
                        <li><strong>📞</strong> +94 XX XXX XXXX</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2026 UniFlowX. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
