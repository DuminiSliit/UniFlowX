import { useState, useEffect } from 'react';
import { bookingService, getResources } from '../services/api';
import { Calendar, Clock, Users, FileText, Send, Landmark } from 'lucide-react';

const BookingForm = ({ onSuccess, preselectedResourceId }) => {
    const [resources, setResources] = useState([]);
    const [formData, setFormData] = useState({
        resourceId: preselectedResourceId || '',
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchingResources, setFetchingResources] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const data = await getResources();
                // Filter for ACTIVE resources only
                setResources(data.filter(r => r.status === 'ACTIVE'));
                if (!preselectedResourceId && data.length > 0) {
                    const activeResources = data.filter(r => r.status === 'ACTIVE');
                    if (activeResources.length > 0) {
                        setFormData(prev => ({ ...prev, resourceId: activeResources[0].id }));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch resources", err);
            } finally {
                setFetchingResources(false);
            }
        };
        fetchResources();
    }, [preselectedResourceId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await bookingService.createBooking({
                ...formData,
                resourceId: parseInt(formData.resourceId)
            });
            alert('Booking request submitted successfully!');
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit booking request.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (fetchingResources) return <div className="empty-state">Loading booking options...</div>;

    return (
        <div className="card" style={{maxWidth: '800px', margin: '0 auto'}}>
            <h2 className="card-title">Reserve a Campus Facility</h2>
            {error && (
                <div style={{ 
                    padding: '1rem', 
                    background: '#fef2f2', 
                    color: 'var(--danger)', 
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    border: '1px solid #fee2e2',
                    fontSize: '0.9rem'
                }}>
                    <strong>Update Failed:</strong> {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="resource-form">
                <div className="form-group">
                    <label><Landmark size={16} style={{verticalAlign: 'middle', marginRight: '6px'}} /> Select Facility / Resource</label>
                    <select 
                        name="resourceId" 
                        value={formData.resourceId} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="" disabled>-- Select a Resource --</option>
                        {resources.map(res => (
                            <option key={res.id} value={res.id}>
                                {res.name} ({res.type} - {res.location})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label><Calendar size={16} style={{verticalAlign: 'middle', marginRight: '6px'}} /> Start Time</label>
                        <input 
                            type="datetime-local" 
                            name="startTime" 
                            value={formData.startTime} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label><Clock size={16} style={{verticalAlign: 'middle', marginRight: '6px'}} /> End Time</label>
                        <input 
                            type="datetime-local" 
                            name="endTime" 
                            value={formData.endTime} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label><Users size={16} style={{verticalAlign: 'middle', marginRight: '6px'}} /> Expected Attendees</label>
                    <input 
                        type="number" 
                        name="expectedAttendees" 
                        value={formData.expectedAttendees} 
                        onChange={handleChange} 
                        placeholder="e.g. 50"
                    />
                </div>

                <div className="form-group">
                    <label><FileText size={16} style={{verticalAlign: 'middle', marginRight: '6px'}} /> Purpose of Booking</label>
                    <textarea 
                        name="purpose" 
                        value={formData.purpose} 
                        onChange={handleChange} 
                        rows="4" 
                        required 
                        placeholder="Please describe the intended use of the facility..."
                    ></textarea>
                </div>

                <div className="form-actions" style={{justifyContent: 'flex-end'}}>
                    <button type="submit" className="btn-primary" disabled={loading} style={{width: 'auto', minWidth: '200px'}}>
                        {loading ? 'Processing...' : <><Send size={18} /> Confirm Reservation</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingForm;
