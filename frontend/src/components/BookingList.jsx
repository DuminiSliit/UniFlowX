import { useEffect, useState } from 'react';
import { bookingService, getResources } from '../services/api';
import { Calendar, Trash2, CheckCircle, XCircle, Info, User, Landmark } from 'lucide-react';

const BookingList = ({ isAdmin }) => {
    const [bookings, setBookings] = useState([]);
    const [resourcesMap, setResourcesMap] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = isAdmin 
                ? await bookingService.getAllBookings()
                : await bookingService.getMyBookings();
            setBookings(response.data);
        } catch (err) {
            console.error('Failed to fetch bookings', err);
        } finally {
            setLoading(false);
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

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await bookingService.cancelBooking(id);
                fetchBookings();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to cancel booking.');
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
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status.');
        }
    };

    const getStatusBadge = (status) => {
        const className = `badge badge-${status.toLowerCase()}`;
        return <span className={className}>{status}</span>;
    };

    if (loading) return <div className="card">Loading bookings...</div>;

    return (
        <div className="card">
            <h2 className="card-title">{isAdmin ? 'All Request History' : 'My Booking History'}</h2>
            {bookings.length === 0 ? (
                <p style={{ color: 'var(--text-light)' }}>No requests found in the queue.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {bookings.map((booking) => (
                        <div key={booking.id} style={{ 
                            border: '1px solid var(--border)', 
                            padding: '1.25rem', 
                            borderRadius: '0.75rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: booking.status === 'PENDING' ? 'var(--bg-subtle)' : 'white'
                        }}>
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
                                            style={{ background: 'var(--success)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                            onClick={() => handleReview(booking.id, 'APPROVED')}
                                        >
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                        <button 
                                            className="btn-primary" 
                                            style={{ background: 'var(--danger)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                            onClick={() => handleReview(booking.id, 'REJECTED')}
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </>
                                )}

                                {!isAdmin && (booking.status === 'PENDING' || booking.status === 'APPROVED') && (
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
                                        title="Cancel Booking"
                                    >
                                        <Trash2 size={22} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingList;
