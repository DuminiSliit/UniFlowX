import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
<<<<<<< HEAD
            try {
                // Decode JWT to get the user data (specifically the email/subject)
                const payload = JSON.parse(atob(token.split('.')[1]));
                const email = payload.sub; // Our backend sets email as subject
                
                const user = {
                    accessToken: token,
                    email: email,
                    roles: ['ROLE_STUDENT']
                };
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/');
                window.location.reload();
            } catch (error) {
                console.error("Error decoding token:", error);
                navigate('/login');
            }
=======
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
>>>>>>> 206b7e2 (Enhance booking details, standardize footer, and polish landing page visuals)
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
