import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // We only have the token from the success handler. 
            // We can decode basic info from JWT or just fetch user info.
            // For simplicity, we'll store a minimal user object.
            const user = {
                accessToken: token,
                email: 'google-user@gmail.com', // Placeholder or decode from JWT
                roles: ['ROLE_STUDENT']
            };
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/');
            window.location.reload();
        } else {
            navigate('/login');
        }
    }, [location, navigate]);

    return (
        <div className="auth-container">
            <div className="loading-spinner"></div>
            <p>Finishing Google Sign-in...</p>
        </div>
    );
};

export default OAuth2RedirectHandler;
