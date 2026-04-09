import { useState } from 'react';
import { bookingService } from '../services/api';
import { Calendar, Clock, Users, FileText, Send } from 'lucide-react';

const BookingForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        resourceId: 1, // Defaulting to 1 for now
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await bookingService.createBooking(formData);
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

    return (
        <div className="card">
            <h2 className="card-title">Book a Resource</h2>
            {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label><FileText size={16} inline /> Resource ID (Module A integration pending)</label>
                    <input 
                        type="number" 
                        name="resourceId" 
                        value={formData.resourceId} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label><Clock size={16} inline /> Start Time</label>
                        <input 
                            type="datetime-local" 
                            name="startTime" 
                            value={formData.startTime} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label><Clock size={16} inline /> End Time</label>
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
                    <label><Users size={16} inline /> Expected Attendees</label>
                    <input 
                        type="number" 
                        name="expectedAttendees" 
                        value={formData.expectedAttendees} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="form-group">
                    <label>Purpose</label>
                    <textarea 
                        name="purpose" 
                        value={formData.purpose} 
                        onChange={handleChange} 
                        rows="3" 
                        required 
                        placeholder="e.g., Guest Lecture, Laboratory Session"
                    ></textarea>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : <><Send size={18} /> Submit Booking Request</>}
                </button>
            </form>
        </div>
    );
};

export default BookingForm;
