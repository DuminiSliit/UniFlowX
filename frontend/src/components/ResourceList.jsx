import React, { useState, useEffect } from 'react';
import { getResources, deleteResource, updateResource } from '../services/api';
import { Search, Filter, MapPin, Users, Info, Edit, Trash2, Power, Calendar } from 'lucide-react';
import './ResourceList.css';

const ResourceList = ({ onEdit, onBook, isAdmin }) => {
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');

    const fetchResources = async () => {
        try {
            const data = await getResources();
            setResources(data);
            setFilteredResources(data);
        } catch (error) {
            console.error("Error fetching resources", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    useEffect(() => {
        const filtered = resources.filter(res => {
            const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                res.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'All' || res.type === typeFilter;
            return matchesSearch && matchesType;
        });
        setFilteredResources(filtered);
    }, [searchTerm, typeFilter, resources]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to completely remove this resource?")) {
            try {
                await deleteResource(id);
                fetchResources();
            } catch (error) {
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
            alert("Could not update status.");
        }
    };

    if (loading) return (
        <div className="empty-state">
            <div className="loading-spinner"></div>
            <p>Loading the campus catalogue...</p>
        </div>
    );

    return (
        <div className="resource-list-container">
            <div className="module-header">
                <div className="title-section">
                    <h2>Campus Catalogue</h2>
                    <p>Discover and reserve facilities, labs, and equipment.</p>
                </div>
                
                <div className="search-filter-bar">
                    <div className="search-input-wrapper">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or location..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="filter-select"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Classroom">Classroom</option>
                        <option value="Lecture Hall">Lecture Hall</option>
                        <option value="Laboratory">Laboratory</option>
                        <option value="Sports Facility">Sports Facility</option>
                        <option value="Equipment">Equipment</option>
                    </select>
                </div>
            </div>
            
            {filteredResources.length === 0 ? (
                <div className="empty-state">
                    <Info size={48} />
                    <p>No resources match your search criteria.</p>
                </div>
            ) : (
                <div className="resource-grid">
                    {filteredResources.map((res) => (
                        <div key={res.id} className={`resource-card ${res.status === 'OUT_OF_SERVICE' ? 'inactive' : ''}`}>
                            <div className="card-image-placeholder">
                                {res.imageBase64 ? (
                                    <img src={res.imageBase64} alt={res.name} className="resource-image" />
                                ) : (
                                    <Calendar size={48} strokeWidth={1} />
                                )}
                                <span className="type-tag">{res.type}</span>
                                <div className="status-indicator">
                                    <span className={`badge badge-${res.status.toLowerCase()}`}>
                                        {res.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="card-content">
                                <div className="resource-header">
                                    <h3>{res.name}</h3>
                                </div>
                                
                                <div className="resource-info">
                                    <div className="info-item">
                                        <MapPin size={16} />
                                        <span>{res.location}</span>
                                    </div>
                                    <div className="info-item">
                                        <Users size={16} />
                                        <span>Capacity: {res.capacity || 'N/A'} persons</span>
                                    </div>
                                </div>
                            </div>

                            <div className="resource-actions">
                                <button 
                                    className="btn-book" 
                                    onClick={() => onBook(res)}
                                    disabled={res.status === 'OUT_OF_SERVICE'}
                                >
                                    Book Now
                                </button>
                                
                                {isAdmin && (
                                    <>
                                        <button className="btn-icon" title="Edit" onClick={() => onEdit(res)}>
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            className="btn-icon" 
                                            title={res.status === 'ACTIVE' ? "Deactivate" : "Activate"}
                                            onClick={() => toggleStatus(res)}
                                        >
                                            <Power size={18} />
                                        </button>
                                        <button className="btn-icon delete" title="Delete" onClick={() => handleDelete(res.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResourceList;
