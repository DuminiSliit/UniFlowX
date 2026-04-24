import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            try {
                // Decode the JWT payload to get the actual email
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decodedToken = JSON.parse(jsonPayload);
                const email = decodedToken.sub; // subject contains the email

                const user = {
                    accessToken: token,
                    email: email,
                    roles: ['ROLE_STUDENT']
                };
                localStorage.setItem('user', JSON.stringify(user));
                // Redirect admin to dashboard, others to home
                const isAdmin = user.roles?.includes('ROLE_ADMIN');
                if (isAdmin) {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                    window.location.reload();
                }
            } catch (e) {
                console.error("Failed to parse token", e);
                navigate('/login');
            }
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
