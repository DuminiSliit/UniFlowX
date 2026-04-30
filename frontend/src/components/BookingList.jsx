import { useEffect, useState } from 'react';
import { bookingService, getResources } from '../services/api';
import { Calendar, Trash2, CheckCircle, XCircle, Info, User, Landmark, Filter, AlertTriangle, Edit2 } from 'lucide-react';
import BookingForm from './BookingForm';

const BookingList = ({ isAdmin }) => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [resourcesMap, setResourcesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [actionError, setActionError] = useState('');
    const [actionSuccess, setActionSuccess] = useState('');
    const [editingBooking, setEditingBooking] = useState(null);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = isAdmin 
                ? await bookingService.getAllBookings()
                : await bookingService.getMyBookings();
            setBookings(response.data);
            applyFilter(response.data, statusFilter);
        } catch (err) {
            console.error('Failed to fetch bookings', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = (data, filter) => {
        if (filter === 'ALL') {
            setFilteredBookings(data);
        } else {
            setFilteredBookings(data.filter(b => b.status === filter));
        }
    };

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await getResources();
                const map = {};
                response.forEach(r => map[r.id] = r.name);
                setResourcesMap(map);
            } catch (err) {
                console.error('Failed to fetch resources map', err);
            }
        };

        fetchResources();
        fetchBookings();
    }, [isAdmin]);

    useEffect(() => {
        applyFilter(bookings, statusFilter);
    }, [statusFilter, bookings]);

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await bookingService.cancelBooking(id);
                setActionSuccess('Booking cancelled successfully.');
                setTimeout(() => setActionSuccess(''), 4000);
                fetchBookings();
            } catch (err) {
                setActionError(err.response?.data?.message || 'Failed to cancel booking.');
                setTimeout(() => setActionError(''), 6000);
            }
        }
    };

    const handleReview = async (id, status) => {
        let reason = '';
        if (status === 'REJECTED') {
            reason = prompt('Optional: Enter rejection reason:') || '';
        }

        try {
            await bookingService.updateStatus(id, status, reason);
            setActionSuccess(`Booking ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully.`);
            setTimeout(() => setActionSuccess(''), 4000);
            fetchBookings();
        } catch (err) {
            setActionError(err.response?.data?.message || 'Failed to update booking status.');
            setTimeout(() => setActionError(''), 6000);
        }
    };

    const getStatusBadge = (status) => {
        const className = `badge badge-${status.toLowerCase()}`;
        return <span className={className}>{status}</span>;
    };

    const filterOptions = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

    if (loading) return <div className="card">Loading bookings...</div>;

    return (
        <div className="card">
            {/* Action Error Banner */}
            {actionError && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.9rem 1.2rem', marginBottom: '1.2rem',
                    background: '#fef2f2', color: '#b91c1c',
                    border: '1px solid #fecaca', borderRadius: '0.75rem',
                    fontSize: '0.9rem', fontWeight: 500
                }}>
                    <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                    <span><strong>Error: </strong>{actionError}</span>
                    <button onClick={() => setActionError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
                </div>
            )}
            {/* Action Success Banner */}
            {actionSuccess && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.9rem 1.2rem', marginBottom: '1.2rem',
                    background: '#f0fdf4', color: '#166534',
                    border: '1px solid #bbf7d0', borderRadius: '0.75rem',
                    fontSize: '0.9rem', fontWeight: 500
                }}>
                    <CheckCircle size={18} style={{ flexShrink: 0 }} />
                    <span>{actionSuccess}</span>
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 className="card-title" style={{ marginBottom: 0 }}>{isAdmin ? 'All Request History' : 'My Booking History'}</h2>
                
                <div style={{ display: 'flex', gap: '0.4rem', background: '#f3f4f6', padding: '0.3rem', borderRadius: '0.75rem' }}>
                    {filterOptions.map(opt => (
                        <button
                            key={opt}
                            onClick={() => setStatusFilter(opt)}
                            style={{
                                padding: '0.4rem 0.8rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                background: statusFilter === opt ? 'white' : 'transparent',
                                color: statusFilter === opt ? 'var(--primary)' : '#6b7280',
                                fontSize: '0.8rem',
                                fontWeight: statusFilter === opt ? '700' : '500',
                                cursor: 'pointer',
                                boxShadow: statusFilter === opt ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            {opt === 'ALL' ? 'All' : opt.charAt(0) + opt.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {filteredBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-light)' }}>
                    <Filter size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <p>No {statusFilter === 'ALL' ? '' : statusFilter.toLowerCase()} requests found in the queue.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredBookings.map((booking) => (
                        <div key={booking.id} style={{ 
                            border: '1px solid var(--border)', 
                            padding: '1.25rem', 
                            borderRadius: '0.75rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: booking.status === 'PENDING' ? '#f8faff' : 'white',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'default'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                                        {booking.purpose}
                                    </h3>
                                    {getStatusBadge(booking.status)}
                                </div>
                                
                                {isAdmin && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                                        <User size={14} /> <strong>{booking.userId}</strong>
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                                    <Landmark size={14} /> 
                                    <strong>
                                        {booking.resource?.name || resourcesMap[booking.resourceId] || 'Campus Facility'}
                                    </strong>
                                </div>

                                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={14} /> {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleTimeString()}
                                </p>
                                
                                {booking.rejectionReason && (
                                    <div style={{ 
                                        marginTop: '0.75rem', 
                                        fontSize: '0.85rem', 
                                        background: '#fff1f2', 
                                        color: '#e11d48',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '0.5rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.4rem'
                                    }}>
                                        <Info size={14} /> <strong>Note:</strong> {booking.rejectionReason}
                                    </div>
                                )}
                            </div>
                            
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                {isAdmin && booking.status === 'PENDING' && (
                                    <>
                                        <button 
                                            className="btn-primary" 
                                            style={{ background: '#10b981', padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                            onClick={() => handleReview(booking.id, 'APPROVED')}
                                        >
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                        <button 
                                            className="btn-primary" 
                                            style={{ background: '#ef4444', padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                            onClick={() => handleReview(booking.id, 'REJECTED')}
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </>
                                )}

                                {!isAdmin && (booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        {booking.status === 'PENDING' && (
                                            <button 
                                                onClick={() => setEditingBooking(booking)}
                                                style={{ 
                                                    background: 'none', 
                                                    border: 'none', 
                                                    color: 'var(--primary)', 
                                                    cursor: 'pointer',
                                                    padding: '0.5rem',
                                                    transition: 'transform 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                title="Edit Booking"
                                            >
                                                <Edit2 size={20} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleCancel(booking.id)}
                                            style={{ 
                                                background: 'none', 
                                                border: 'none', 
                                                color: 'var(--danger)', 
                                                cursor: 'pointer',
                                                padding: '0.5rem',
                                                transition: 'transform 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            title="Cancel Booking"
                                        >
                                            <Trash2 size={22} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal Overlay */}
            {editingBooking && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }}>
                    <div style={{ width: '100%', maxWidth: '850px' }}>
                        <BookingForm 
                            initialData={editingBooking} 
                            onSuccess={() => {
                                setEditingBooking(null);
                                fetchBookings();
                            }}
                            onCancel={() => setEditingBooking(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingList;
