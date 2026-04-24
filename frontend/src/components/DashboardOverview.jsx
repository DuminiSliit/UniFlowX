import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Building2,
    Calendar,
    Ticket,
    Bell,
    Search,
    LogOut,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    ShieldCheck,
    Settings,
    Activity
} from 'lucide-react';
import authService from '../services/authService';
import { bookingService, getResources } from '../services/api';
import AdminUsers from './AdminUsers';
import './DashboardOverview.css';

const DashboardOverview = ({ setView, isAdmin }) => {
    const currentUser = authService.getCurrentUser();
    const roles = currentUser?.roles || [];
    const isStaff = roles.includes('ROLE_STAFF');
    const isStudent = roles.includes('ROLE_STUDENT');
    const roleLabel = isAdmin ? 'Administrator' : (isStaff ? 'Staff' : 'Student');
    const portalLabel = isAdmin ? 'Admin Panel' : (isStaff ? 'Staff Portal' : 'Student Portal');
    const dashboardTitle = isAdmin ? 'Admin Dashboard' : (isStaff ? 'Staff Dashboard' : 'Student Dashboard');

    const [activeSideNav, setActiveSideNav] = useState('dashboard');
    const [bookingStats, setBookingStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [resourceCount, setResourceCount] = useState(0);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const displayName = currentUser?.fullName || (currentUser?.email
        ? currentUser.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        : 'User');

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        const load = async () => {
            try {
                const bookingFetch = isAdmin ? bookingService.getAllBookings() : bookingService.getMyBookings();
                const [bookingRes, resourceRes] = await Promise.allSettled([
                    bookingFetch,
                    getResources()
                ]);

                if (bookingRes.status === 'fulfilled') {
                    const bookings = bookingRes.value?.data || [];
                    setBookingStats({
                        total: bookings.length,
                        pending: bookings.filter(b => b.status === 'PENDING').length,
                        approved: bookings.filter(b => b.status === 'APPROVED').length,
                        rejected: bookings.filter(b => b.status === 'REJECTED').length,
                    });
                    setRecentBookings(bookings.slice(0, 5));
                }
                if (resourceRes.status === 'fulfilled') {
                    const resData = resourceRes.value;
                    setResourceCount(Array.isArray(resData) ? resData.length : (resData?.length || 0));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [isAdmin]);

    const handleLogout = () => {
        authService.logout();
        window.location.href = '/';
    };

    const sideNavItems = isAdmin
        ? [
            { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { key: 'users', label: 'Users', icon: Users },
            { key: 'resources-list', label: 'Resources', icon: Building2 },
            { key: 'list', label: 'Bookings', icon: Calendar },
            { key: 'tickets', label: 'Tickets', icon: Ticket },
        ]
        : [
            { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { key: 'list', label: 'My Bookings', icon: Calendar },
            { key: 'tickets', label: 'My Tickets', icon: Ticket },
            { key: 'resources-list', label: 'Resources', icon: Building2 },
            { key: 'profile', label: 'Settings', icon: Settings },
        ];

    const statCards = isAdmin
        ? [
            { label: 'All Resources', value: resourceCount, icon: Building2, color: '#6c63ff', trend: '+12%', up: true },
            { label: 'Active Bookings', value: bookingStats.approved, icon: Calendar, color: '#10b981', trend: '+5%', up: true },
            { label: 'Open Tickets', value: 0, icon: Ticket, color: '#f59e0b', trend: '-3%', up: false },
            { label: 'Pending Reviews', value: bookingStats.pending, icon: ShieldCheck, color: '#8b5cf6', trend: '+8%', up: true },
        ]
        : [
            { label: 'Available Resources', value: resourceCount, icon: Building2, color: '#0891b2', trend: '+12%', up: true },
            { label: 'My Bookings', value: bookingStats.total, icon: Calendar, color: '#10b981', trend: '+5%', up: true },
            { label: 'Open Tickets', value: 0, icon: Ticket, color: '#ea580c', trend: '-3%', up: false },
            { label: 'Notifications', value: 3, icon: Bell, color: '#8b5cf6', trend: '+8%', up: true },
        ];

    const actionTiles = isAdmin
        ? [
            { label: 'Manage Users', sub: 'View and manage user accounts', icon: Users, color: 'linear-gradient(135deg,#7c3aed,#a855f7)', badge: null, view: 'users' },
            { label: 'View Bookings', sub: 'Check all booking requests', icon: Calendar, color: 'linear-gradient(135deg,#059669,#10b981)', badge: bookingStats.total, view: 'list' },
            { label: 'Handle Tickets', sub: 'Resolve support tickets', icon: Ticket, color: 'linear-gradient(135deg,#dc2626,#f97316)', badge: 0, view: 'tickets' },
            { label: 'Resources', sub: 'Manage campus resources', icon: Building2, color: 'linear-gradient(135deg,#0891b2,#06b6d4)', badge: resourceCount, view: 'resources-list' },
        ]
        : [
            { label: 'New Booking', sub: 'Reserve a study room or equipment', icon: Calendar, color: 'linear-gradient(135deg,#7c3aed,#a855f7)', badge: null, view: 'resources-list' },
            { label: 'Report Incident', sub: 'Report a facility or technical issue', icon: Bell, color: 'linear-gradient(135deg,#f97316,#ea580c)', badge: null, view: 'tickets' },
            { label: 'Browse Resources', sub: 'Explore available campus facilities', icon: Building2, color: 'linear-gradient(135deg,#0891b2,#06b6d4)', badge: null, view: 'resources-list' },
        ];

    const statusBadge = (status) => {
        const map = {
            PENDING: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
            APPROVED: { bg: '#d1fae5', color: '#065f46', label: 'Approved' },
            REJECTED: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
        };
        const s = map[status] || { bg: '#f3f4f6', color: '#374151', label: status };
        return <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
    };

    return (
        <div className="admin-dashboard-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <ShieldCheck size={22} color="#fff" />
                    </div>
                    <div>
                        <div className="sidebar-brand-name">UniFlowX</div>
                        <div className="sidebar-brand-sub">{portalLabel}</div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {sideNavItems.map(item => (
                        <button
                            key={item.key}
                            className={`sidebar-nav-item ${activeSideNav === item.key ? 'active' : ''}`}
                            onClick={() => {
                                setActiveSideNav(item.key);
                                // Users is handled internally; others bubble up to parent
                                if (item.key !== 'dashboard' && item.key !== 'users') setView(item.key);
                            }}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-user">
                    <div className="sidebar-user-avatar">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{displayName}</div>
                        <div className="sidebar-user-email">{currentUser?.email}</div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-main">
                {/* Top Bar */}
                <header className="admin-topbar">
                    <div>
                        <h1 className="admin-topbar-title">{dashboardTitle}</h1>
                        <p className="admin-topbar-sub">Welcome back, {displayName}</p>
                    </div>
                    <div className="admin-topbar-actions">
                        <div className="admin-search">
                            <Search size={16} />
                            <input placeholder="Search bookings, tickets, resources..." />
                        </div>
                        <button className="topbar-icon-btn" title="Notifications">
                            <Bell size={20} />
                            {(isAdmin ? bookingStats.pending : 3) > 0 && <span className="notif-dot">{isAdmin ? bookingStats.pending : 3}</span>}
                        </button>
                        <div className="topbar-user-chip">
                            <div className="topbar-avatar">{displayName.charAt(0).toUpperCase()}</div>
                            <div>
                                <div className="topbar-user-name">{displayName}</div>
                                <div className="topbar-user-role">{roleLabel}</div>
                            </div>
                        </div>
                        <button className="topbar-icon-btn" title="Logout" onClick={handleLogout}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                <div className="admin-content">
                    {/* Users sub-page */}
                    {activeSideNav === 'users' && isAdmin ? (
                        <AdminUsers onBack={() => setActiveSideNav('dashboard')} />
                    ) : (
                    <>
                    {/* Welcome Banner */}
                    <div className="welcome-banner">
                        <div className="welcome-banner-left">
                            <div className="welcome-banner-icon">
                                <ShieldCheck size={28} color="#fff" />
                            </div>
                            <div>
                                <h2>Welcome back, {displayName}!</h2>
                                <p>{isAdmin ? `Here's your comprehensive system overview for ${today}.` : 'All your campus resources and activities in one place. What would you like to do today?'}</p>
                            </div>
                        </div>
                        <div className="welcome-banner-right">
                            <Activity size={18} color="#7c3aed" />
                            <span className="system-status-label">System Status</span>
                            <span className="system-status-dot" />
                            <span className="system-status-text">All Systems Online</span>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="stat-cards-grid">
                        {statCards.map((card, i) => (
                            <div className="stat-card" key={i} onClick={() => {
                                if (card.label === 'Notifications') return;
                                setView(card.label === 'Open Tickets' ? 'tickets' : (card.label === 'Available Resources' || card.label === 'All Resources' ? 'resources-list' : 'list'))
                            }} style={{ cursor: 'pointer' }}>
                                <div className="stat-card-left">
                                    <div className="stat-card-label">{card.label}</div>
                                    <div className="stat-card-value">{loading ? '–' : card.value}</div>
                                    {card.trend && (
                                        <div className={`stat-card-trend ${card.up ? 'up' : 'down'}`}>
                                            {card.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            <span>{card.trend} vs last month</span>
                                        </div>
                                    )}
                                </div>
                                <div className="stat-card-icon" style={{ background: card.color + '22' }}>
                                    <card.icon size={26} color={card.color} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Tiles */}
                    <div className="action-tiles-grid">
                        {actionTiles.map((tile, i) => (
                            <button
                                key={i}
                                className="action-tile"
                                style={{ background: tile.color }}
                                onClick={() => {
                                    if (tile.view === 'users') {
                                        setActiveSideNav('users');
                                    } else {
                                        setView(tile.view);
                                    }
                                }}
                            >
                                {tile.badge !== null && (
                                    <div className="action-tile-badge">{tile.badge}</div>
                                )}
                                <tile.icon size={36} color="rgba(255,255,255,0.9)" />
                                <div className="action-tile-label">{tile.label}</div>
                                <div className="action-tile-sub">{tile.sub}</div>
                            </button>
                        ))}
                    </div>

                    {/* Bottom Panels */}
                    <div className="bottom-panels">
                        <div className="panel">
                            <div className="panel-header">
                                <h3>{isAdmin ? 'Recent Bookings' : 'Recent My Bookings'}</h3>
                                <button className="panel-view-all" onClick={() => setView('list')}>
                                    View All <ChevronRight size={14} />
                                </button>
                            </div>
                            {loading ? (
                                <div className="panel-empty">Loading...</div>
                            ) : recentBookings.length === 0 ? (
                                <div className="panel-empty">No bookings yet.</div>
                            ) : (
                                <table className="panel-table">
                                    <thead>
                                        <tr>
                                            <th>Resource</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentBookings.map((b, i) => (
                                            <tr key={i}>
                                                <td>{b.resourceName || b.resource?.name || '—'}</td>
                                                <td>{b.startTime ? new Date(b.startTime).toLocaleDateString() : '—'}</td>
                                                <td>{statusBadge(b.status)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="panel">
                            <div className="panel-header">
                                <h3>{isAdmin ? 'Open Tickets' : 'My Incidents'}</h3>
                                <button className="panel-view-all" onClick={() => setView('tickets')}>
                                    View All <ChevronRight size={14} />
                                </button>
                            </div>
                            <div className="panel-empty" style={{ padding: '2rem 0' }}>
                                <Ticket size={32} color="#d1d5db" style={{ marginBottom: 8 }} />
                                <div>{isAdmin ? 'No open tickets.' : 'No reported incidents.'}</div>
                                <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 4 }}>Module integration pending.</div>
                            </div>
                        </div>
                    </div>
                    </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
