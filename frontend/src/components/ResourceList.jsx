import React, { useState, useEffect } from 'react';
import { getResources, deleteResource, updateResource } from '../services/api';
import './ResourceList.css';

const ResourceList = ({ onEdit }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchResources = async () => {
        try {
            const data = await getResources();
            setResources(data);
        } catch (error) {
            console.error("Error fetching resources", error);
            alert("Could not load facilities and assets.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to completely remove this resource?")) {
            try {
                await deleteResource(id);
                fetchResources(); // Refresh
            } catch (error) {
                console.error("Error deleting resource", error);
                alert("Could not delete resource.");
            }
        }
    };

    const toggleStatus = async (resource) => {
        const newStatus = resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
        try {
            await updateResource(resource.id, { ...resource, status: newStatus });
            fetchResources();
        } catch (error) {
            console.error("Error updating status", error);
            alert("Could not update resource status.");
        }
    };

    if (loading) return <div className="loading-spinner">Loading Catalogue...</div>;

    return (
        <div className="resource-list-container">
            <h2 className="module-title">Facilities & Assets Catalogue</h2>
            
            {resources.length === 0 ? (
                <div className="empty-state">
                    <p>No resources found in the catalogue.</p>
                </div>
            ) : (
                <div className="resource-grid">
                    {resources.map((res) => (
                        <div key={res.id} className={`resource-card ${res.status === 'OUT_OF_SERVICE' ? 'inactive' : ''}`}>
                            <div className="resource-header">
                                <h3>{res.name}</h3>
                                <span className={`status-badge ${res.status.toLowerCase()}`}>
                                    {res.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <div className="resource-details">
                                <p><strong>Type:</strong> {res.type}</p>
                                <p><strong>Location:</strong> {res.location}</p>
                                <p><strong>Capacity:</strong> {res.capacity || 'N/A'} persons</p>
                            </div>
                            <div className="resource-actions">
                                <button className="btn-edit" onClick={() => onEdit(res)}>Edit</button>
                                <button className="btn-toggle" onClick={() => toggleStatus(res)}>
                                    Mark as {res.status === 'ACTIVE' ? 'Out of Service' : 'Active'}
                                </button>
                                <button className="btn-delete" onClick={() => handleDelete(res.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResourceList;
