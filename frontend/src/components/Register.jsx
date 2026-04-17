import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import './Login.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await authService.register(email, password, [role]);
            setSuccess('Account created successfully! You can now log in.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="logo-icon register">
                        <UserPlus size={32} />
                    </div>
                    <h1>Join UniFlowX</h1>
                    <p>Create your smart campus account today</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="auth-success">
                        <CheckCircle size={18} />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={18} />
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="name@uni.edu" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} />
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="Min 6 characters" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                minLength="6"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Account Type</label>
                        <div className="role-selector">
                            <label className={`role-option ${role === 'student' ? 'active' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="student" 
                                    checked={role === 'student'} 
                                    onChange={() => setRole('student')}
                                />
                                Student
                            </label>
                            <label className={`role-option ${role === 'staff' ? 'active' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="staff" 
                                    checked={role === 'staff'} 
                                    onChange={() => setRole('staff')}
                                />
                                Staff
                            </label>
                            <label className={`role-option ${role === 'admin' ? 'active' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="admin" 
                                    checked={role === 'admin'} 
                                    onChange={() => setRole('admin')}
                                />
                                Admin
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn-auth" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Get Started'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Log In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
