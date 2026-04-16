import { useEffect, useState } from 'react';
import { bookingService } from '../services/api';
import { Calendar, Trash2, CheckCircle, XCircle, Info } from 'lucide-react';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const response = await bookingService.getMyBookings();
            setBookings(response.data);
        } catch (err) {
            console.error('Failed to fetch bookings', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

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

    const getStatusBadge = (status) => {
        const className = `badge badge-${status.toLowerCase()}`;
        return <span className={className}>{status}</span>;
    };

    if (loading) return <div className="card">Loading bookings...</div>;

    return (
        <div className="card">
            <h2 className="card-title">My Booking History</h2>
            {bookings.length === 0 ? (
                <p style={{ color: 'var(--text-light)' }}>No bookings found.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {bookings.map((booking) => (
                        <div key={booking.id} style={{ 
                            border: '1px solid var(--border)', 
                            padding: '1rem', 
                            borderRadius: '0.75rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                    {booking.purpose}
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={14} /> {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleTimeString()}
                                </p>
                                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    {getStatusBadge(booking.status)}
                                    {booking.rejectionReason && (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Info size={12} /> {booking.rejectionReason}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                                <button 
                                    onClick={() => handleCancel(booking.id)}
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        color: 'var(--danger)', 
                                        cursor: 'pointer',
                                        padding: '0.5rem',
                                        borderRadius: '0.25rem'
                                    }}
                                    title="Cancel Booking"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingList;
