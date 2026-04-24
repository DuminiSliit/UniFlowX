import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Shield,
    User,
    Mail,
    Phone,
    RefreshCw,
    ChevronLeft,
    UserCheck,
    UserX,
    Filter
} from 'lucide-react';
import { userService } from '../services/api';
import './AdminUsers.css';

const AdminUsers = ({ onBack }) => {
    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await userService.getAllUsers();
            setUsers(res.data || []);
            setFiltered(res.data || []);
        } catch (e) {
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = users;
        if (roleFilter !== 'ALL') {
            result = result.filter(u => u.roles?.includes(roleFilter));
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(u =>
                u.email?.toLowerCase().includes(q) ||
                u.fullName?.toLowerCase().includes(q)
            );
        }
        setFiltered(result);
    }, [search, roleFilter, users]);

    const getRoleBadge = (roles) => {
        const isAdmin = roles?.includes('ROLE_ADMIN');
        return isAdmin
            ? <span className="au-role-badge admin"><Shield size={12} /> Admin</span>
            : <span className="au-role-badge student"><User size={12} /> Student</span>;
    };

    const getAvatar = (user) => {
        const name = user.fullName || user.email || '?';
        return name.charAt(0).toUpperCase();
    };

    const getAvatarColor = (id) => {
        const colors = [
            'linear-gradient(135deg,#7c3aed,#a855f7)',
            'linear-gradient(135deg,#059669,#10b981)',
            'linear-gradient(135deg,#dc2626,#f97316)',
            'linear-gradient(135deg,#0891b2,#06b6d4)',
            'linear-gradient(135deg,#d97706,#f59e0b)',
            'linear-gradient(135deg,#7c3aed,#6366f1)',
        ];
        return colors[(id || 0) % colors.length];
    };

    const totalAdmins = users.filter(u => u.roles?.includes('ROLE_ADMIN')).length;
    const totalStudents = users.filter(u => !u.roles?.includes('ROLE_ADMIN')).length;

    return (
        <div className="admin-users-page">
            {/* Page Header */}
            <div className="au-header">
                <div className="au-header-left">
                    <button className="au-back-btn" onClick={onBack}>
                        <ChevronLeft size={18} /> Dashboard
                    </button>
                    <div>
                        <h1 className="au-title">User Management</h1>
                        <p className="au-subtitle">View and manage all registered platform users</p>
                    </div>
                </div>
                <button className="au-refresh-btn" onClick={fetchUsers} disabled={loading}>
                    <RefreshCw size={16} className={loading ? 'spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="au-summary-cards">
                <div className="au-summary-card">
                    <div className="au-summary-icon" style={{ background: '#ede9fe' }}>
                        <Users size={22} color="#7c3aed" />
                    </div>
                    <div>
                        <div className="au-summary-value">{users.length}</div>
                        <div className="au-summary-label">Total Users</div>
                    </div>
                </div>
                <div className="au-summary-card">
                    <div className="au-summary-icon" style={{ background: '#d1fae5' }}>
                        <UserCheck size={22} color="#059669" />
                    </div>
                    <div>
                        <div className="au-summary-value">{totalStudents}</div>
                        <div className="au-summary-label">Students</div>
                    </div>
                </div>
                <div className="au-summary-card">
                    <div className="au-summary-icon" style={{ background: '#ede9fe' }}>
                        <Shield size={22} color="#7c3aed" />
                    </div>
                    <div>
                        <div className="au-summary-value">{totalAdmins}</div>
                        <div className="au-summary-label">Administrators</div>
                    </div>
                </div>
                <div className="au-summary-card">
                    <div className="au-summary-icon" style={{ background: '#dbeafe' }}>
                        <UserX size={22} color="#2563eb" />
                    </div>
                    <div>
                        <div className="au-summary-value">{filtered.length}</div>
                        <div className="au-summary-label">Showing</div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="au-toolbar">
                <div className="au-search">
                    <Search size={16} />
                    <input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="au-filter">
                    <Filter size={15} />
                    <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                        <option value="ALL">All Roles</option>
                        <option value="ROLE_ADMIN">Admins Only</option>
                        <option value="ROLE_STUDENT">Students Only</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            {error && (
                <div className="au-error">{error}</div>
            )}

            {loading ? (
                <div className="au-loading">
                    <div className="au-spinner" />
                    <span>Loading users...</span>
                </div>
            ) : filtered.length === 0 ? (
                <div className="au-empty">
                    <Users size={48} color="#d1d5db" />
                    <p>No users found matching your filters.</p>
                </div>
            ) : (
                <div className="au-table-wrapper">
                    <table className="au-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="au-user-cell">
                                            <div
                                                className="au-avatar"
                                                style={{ background: getAvatarColor(user.id) }}
                                            >
                                                {getAvatar(user)}
                                            </div>
                                            <div>
                                                <div className="au-user-name">
                                                    {user.fullName || <span className="au-no-name">No name set</span>}
                                                </div>
                                                <div className="au-user-email-sm">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="au-email-cell">
                                            <Mail size={14} color="#9ca3af" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="au-phone-cell">
                                            {user.phone ? (
                                                <><Phone size={14} color="#9ca3af" /> {user.phone}</>
                                            ) : (
                                                <span className="au-no-name">—</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>{getRoleBadge(user.roles)}</td>
                                    <td><span className="au-id-badge">#{user.id}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="au-footer-count">
                Showing {filtered.length} of {users.length} users
            </div>
        </div>
    );
};

export default AdminUsers;
