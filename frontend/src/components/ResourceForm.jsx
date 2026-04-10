import React, { useState, useEffect } from 'react';
import { createResource, updateResource } from '../services/api';
import './ResourceForm.css';

const ResourceForm = ({ onSuccess, onCancel, editingResource }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Classroom',
        location: '',
        capacity: 30,
        status: 'ACTIVE'
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingResource) {
            setFormData({
                name: editingResource.name,
                type: editingResource.type,
                location: editingResource.location,
                capacity: editingResource.capacity,
                status: editingResource.status
            });
        }
    }, [editingResource]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            if (editingResource) {
                await updateResource(editingResource.id, formData);
                alert("Resource Updated successfully!");
            } else {
                await createResource(formData);
                alert("New Facility/Asset added to Catalogue!");
            }
            onSuccess();
        } catch (error) {
            console.error("Error submitting resource form", error);
            alert("Failed to save resource.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="resource-form-container">
            <h2>{editingResource ? 'Edit Facility/Asset' : 'Add New Facility/Asset'}</h2>
            <form onSubmit={handleSubmit} className="resource-form">
                
                <div className="form-group">
                    <label>Resource Name:</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        placeholder="e.g. Main Auditorium"
                    />
                </div>

                <div className="form-group">
                    <label>Resource Type:</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                        <option value="Classroom">Classroom</option>
                        <option value="Lecture Hall">Lecture Hall</option>
                        <option value="Laboratory">Laboratory</option>
                        <option value="Sports Facility">Sports Facility</option>
                        <option value="Equipment">Equipment / Asset</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Location:</label>
                    <input 
                        type="text" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange}
                        placeholder="e.g. Building A, Floor 2"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Capacity (Persons):</label>
                    <input 
                        type="number" 
                        name="capacity" 
                        value={formData.capacity} 
                        onChange={handleChange}
                        min="1"
                    />
                </div>

                {editingResource && (
                    <div className="form-group">
                        <label>Current Status:</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="ACTIVE">Active (Available)</option>
                            <option value="OUT_OF_SERVICE">Out of Service</option>
                        </select>
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" disabled={isSubmitting} className="btn-primary">
                        {isSubmitting ? 'Saving...' : 'Save Resource'}
                    </button>
                    {onCancel && (
                        <button type="button" onClick={onCancel} className="btn-secondary">
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ResourceForm;
