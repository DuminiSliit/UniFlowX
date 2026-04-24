import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import { User, Mail, Shield, Calendar, AlertCircle, Bell, Edit2, Phone, Save, X, Key } from 'lucide-react';
import authService from '../services/authService';
import { bookingService, userService } from '../services/api';

const UserProfile = () => {
    const currentUser = authService.getCurrentUser();
    const [profileData, setProfileData] = useState({ fullName: '', phone: '', email: currentUser?.email || '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ fullName: '', phone: '' });
    const [isLoading, setIsLoading] = useState(true);
    
    // Password change state
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
        if (currentUser) {
            // Fetch user profile
            userService.getProfile()
                .then(res => {
                    setProfileData({
                        fullName: res.data.fullName || '',
                        phone: res.data.phone || '',
                        email: res.data.email
                    });
                    setEditForm({
                        fullName: res.data.fullName || '',
                        phone: res.data.phone || ''
                    });
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching user profile", err);
                    setIsLoading(false);
                });
        }
    }, [currentUser]);

    const handleSaveProfile = () => {
        userService.updateProfile(editForm)
            .then(res => {
                setProfileData({ ...profileData, fullName: res.data.fullName || '', phone: res.data.phone || '' });
                setIsEditing(false);
            })
            .catch(err => console.error("Error updating profile", err));
    };

    const handleChangePassword = () => {
        setPasswordError('');
        setPasswordSuccess('');
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            return;
        }
        
        userService.updatePassword({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword
        }).then(res => {
            setPasswordSuccess("Password successfully updated!");
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setIsChangingPassword(false);
                setPasswordSuccess('');
            }, 2000);
        }).catch(err => {
            setPasswordError(err.response?.data?.message || "Failed to update password.");
        });
    };

    if (!currentUser || isLoading) return <div className="profile-container"><div className="loading-spinner"></div></div>;

    return (
        <div className="profile-container" style={{maxWidth: '800px'}}>
            <h2 className="card-title">Account Settings</h2>
            
            <div className="profile-grid" style={{gridTemplateColumns: '1fr'}}>
                {/* Left Column: Personal Info */}
                <div className="card profile-card">
                    <div className="profile-header" style={{position: 'relative'}}>
                        {isEditing ? (
                            <div style={{position: 'absolute', top: 0, right: 0, display: 'flex', gap: '0.5rem'}}>
                                <button className="btn-primary" onClick={handleSaveProfile} style={{padding: '0.5rem 1rem', fontSize: '0.85rem'}}>
                                    <Save size={14} /> Save
                                </button>
                                <button className="btn-secondary" onClick={() => { setIsEditing(false); setEditForm({fullName: profileData.fullName, phone: profileData.phone}); }} style={{padding: '0.5rem 1rem', fontSize: '0.85rem', background: '#f1f5f9', color: '#475569', border: 'none'}}>
                                    <X size={14} /> Cancel
                                </button>
                            </div>
                        ) : (
                            <button 
                                className="btn-secondary" 
                                onClick={() => setIsEditing(true)}
                                style={{position: 'absolute', top: 0, right: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)'}}
                            >
                                <Edit2 size={14} /> Edit Profile
                            </button>
                        )}
                        <div className="profile-avatar">
                            <User size={48} />
                        </div>
                        <div className="profile-title" style={{marginTop: isEditing ? '2.5rem' : '0'}}>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={editForm.fullName}
                                    onChange={e => setEditForm({...editForm, fullName: e.target.value})}
                                    placeholder="Enter your full name"
                                    style={{fontSize: '1.2rem', padding: '0.5rem', marginBottom: '0.5rem', width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'}}
                                />
                            ) : (
                                <h3>{profileData.fullName || profileData.email.split('@')[0]}</h3>
                            )}
                            <span className="badge badge-approved">
                                {currentUser.roles?.includes('ROLE_ADMIN') ? 'Administrator' : 'Student/Staff'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="profile-details">
                        <div className="detail-item">
                            <Mail className="detail-icon" size={24} />
                            <div className="detail-text">
                                <label>Email Address</label>
                                <p>{profileData.email}</p>
                            </div>
                        </div>

                        <div className="detail-item">
                            <Phone className="detail-icon" size={24} />
                            <div className="detail-text" style={{width: '100%'}}>
                                <label>Phone Number</label>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={editForm.phone}
                                        onChange={e => setEditForm({...editForm, phone: e.target.value})}
                                        placeholder="Add phone number"
                                        style={{padding: '0.4rem', width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'}}
                                    />
                                ) : (
                                    <p>{profileData.phone || <span style={{color: 'var(--text-muted)', fontStyle: 'italic'}}>Not provided</span>}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <Shield className="detail-icon" size={24} />
                            <div className="detail-text">
                                <label>Security Roles</label>
                                <p>{currentUser.roles?.map(r => r.replace('ROLE_', '')).join(', ')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Change Password Section */}
                    {isChangingPassword ? (
                        <div className="detail-item" style={{flexDirection: 'column', marginTop: '1rem', border: '1px solid var(--primary-light)'}}>
                            <h4 style={{marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)'}}><Key size={18}/> Change Password</h4>
                            {passwordError && <div style={{color: 'var(--danger)', marginBottom: '0.5rem', fontSize: '0.9rem'}}>{passwordError}</div>}
                            {passwordSuccess && <div style={{color: 'var(--success)', marginBottom: '0.5rem', fontSize: '0.9rem'}}>{passwordSuccess}</div>}
                            
                            <input type="password" placeholder="Current Password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="form-control" style={{marginBottom: '0.5rem', padding: '0.6rem', width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'}}/>
                            <input type="password" placeholder="New Password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="form-control" style={{marginBottom: '0.5rem', padding: '0.6rem', width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'}}/>
                            <input type="password" placeholder="Confirm New Password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="form-control" style={{marginBottom: '1rem', padding: '0.6rem', width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)'}}/>
                            
                            <div style={{display: 'flex', gap: '0.5rem', width: '100%'}}>
                                <button className="btn-primary" onClick={handleChangePassword} style={{padding: '0.6rem 1rem', fontSize: '0.9rem', flex: 1}}>Update Password</button>
                                <button className="btn-secondary" onClick={() => { setIsChangingPassword(false); setPasswordError(''); setPasswordSuccess(''); }} style={{padding: '0.6rem 1rem', fontSize: '0.9rem', background: '#f1f5f9', color: '#475569', border: 'none', flex: 1}}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <button className="btn-secondary" onClick={() => setIsChangingPassword(true)} style={{marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1rem', fontSize: '0.95rem', background: 'transparent', color: 'var(--text-main)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', width: '100%', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'}}>
                            <Key size={18} /> Change Account Password
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
