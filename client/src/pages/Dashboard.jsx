import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// Corrected import paths based on typical structure (e.g., assuming context is in src/context)
import { useAuth } from '../context/AuthContext';
import EventList from '../components/EventList';
import EventForm from '../components/EventForm';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const Dashboard = () => {
    const { logout, user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/events`);
            setEvents(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch events:', err);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);
    
    const updateEventStatus = async (eventId, newStatus) => {
        try {
            await axios.put(`${API_BASE_URL}/events/${eventId}`, { status: newStatus });
            fetchEvents();
        } catch (err) {
            console.error('Failed to update event status:', err);
            // Changed alert to console error as per guidelines
            console.error('Failed to update event status.');
        }
    };
    
    const createNewEvent = async (newEventData) => {
        try {
            await axios.post(`${API_BASE_URL}/events`, newEventData);
            fetchEvents();
        } catch (err) {
            console.error('Failed to create event:', err);
            // Changed alert to console error as per guidelines
            console.error('Failed to create new event.');
        }
    };

    // ⭐️ Implemented DELETE function
    const deleteEvent = async (eventId, eventTitle) => {
        // We must implement a confirmation dialog here instead of alert/confirm
        // NOTE: Using window.confirm temporarily, but a custom modal is better practice
        if (!window.confirm(`Are you sure you want to delete the event: "${eventTitle}"? This cannot be undone.`)) {
            return;
        }

        try {
            // Note: The backend route is already confirmed to be working in eventRoutes.js
            await axios.delete(`${API_BASE_URL}/events/${eventId}`);
            // Optimistically update the UI, then re-fetch for absolute accuracy
            setEvents(events.filter(event => event._id !== eventId));
            console.log(`Event "${eventTitle}" deleted successfully.`);
        } catch (err) {
            console.error('Failed to delete event:', err);
            // Changed alert to console error as per guidelines
            console.error('Failed to delete event. Please check server logs.');
            // Re-fetch in case of failure to resync state
            fetchEvents();
        }
    };

    if (loading) return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d2d2d 100%)',
            color: 'white',
            fontSize: '24px',
            fontWeight: '600'
        }}>
            Loading Dashboard...
        </div>
    );

    const pendingRequestsCount = events.filter(e => e.status === 'SWAP_PENDING').length;

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d2d2d 100%)',
            padding: '20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            margin: 0
        }}>
            <div style={{ 
                width: '100%',
                maxWidth: '900px', 
                padding: '40px 35px', 
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '16px', 
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                // Force center positioning - SAME AS LOGIN/SIGNUP
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <div>
                        <h1 style={{ 
                            margin: 0, 
                            fontSize: '28px',
                            fontWeight: '700',
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Welcome back, {user?.name || 'User'}! 👋
                        </h1>
                        <p style={{ 
                            margin: '5px 0 0 0', 
                            color: '#888',
                            fontSize: '14px'
                        }}>
                            Manage your schedule and slot swaps
                        </p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Link 
                            to="/marketplace" 
                            style={{ 
                                padding: '10px 20px',
                                background: '#2d2d2d',
                                color: '#e1e5e9',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                border: '1px solid #404040',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#3d3d3d';
                                e.target.style.borderColor = '#667eea';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = '#2d2d2d';
                                e.target.style.borderColor = '#404040';
                            }}
                        >
                            Marketplace
                        </Link>
                        
                        <Link 
                            to="/requests" 
                            style={{ 
                                padding: '10px 20px',
                                background: pendingRequestsCount > 0 ? '#764ba2' : '#2d2d2d',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                border: pendingRequestsCount > 0 ? '1px solid #764ba2' : '1px solid #404040',
                                fontSize: '14px',
                                fontWeight: pendingRequestsCount > 0 ? '700' : '600',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                if (pendingRequestsCount > 0) {
                                    e.target.style.background = '#667eea';
                                    e.target.style.borderColor = '#667eea';
                                } else {
                                    e.target.style.background = '#3d3d3d';
                                    e.target.style.borderColor = '#667eea';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (pendingRequestsCount > 0) {
                                    e.target.style.background = '#764ba2';
                                    e.target.style.borderColor = '#764ba2';
                                } else {
                                    e.target.style.background = '#2d2d2d';
                                    e.target.style.borderColor = '#404040';
                                }
                            }}
                        >
                            Requests {pendingRequestsCount > 0 && `(${pendingRequestsCount})`}
                        </Link>
                        
                        <button 
                            onClick={logout}
                            style={{
                                padding: '10px 20px',
                                background: 'transparent',
                                color: '#ff6b6b',
                                border: '1px solid #ff6b6b',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#ff6b6b';
                                e.target.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = '#ff6b6b';
                            }}
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Create Event Section */}
                <div style={{ 
                    marginBottom: '30px',
                    background: '#2d2d2d',
                    borderRadius: '12px',
                    border: '1px solid #404040',
                    overflow: 'hidden'
                }}>
                    <details style={{ margin: 0 }}>
                        <summary style={{ 
                            cursor: 'pointer', 
                            fontWeight: '700',
                            fontSize: '16px',
                            padding: '20px',
                            background: '#2d2d2d',
                            color: '#e1e5e9',
                            listStyle: 'none',
                            transition: 'background 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#3d3d3d'}
                        onMouseOut={(e) => e.target.style.background = '#2d2d2d'}
                        >
                            ➕ Create New Event (Slot)
                        </summary>
                        <div style={{ padding: '25px' }}>
                            <EventForm onCreate={createNewEvent} />
                        </div>
                    </details>
                </div>

                {/* Events Section */}
                <div>
                    <h2 style={{ 
                        margin: '0 0 20px 0',
                        fontSize: '22px',
                        fontWeight: '700',
                        color: '#e1e5e9'
                    }}>
                        My Slots ({events.length})
                    </h2>
                    
                    {/*  Passing the onDelete handler to EventList */}
                    <EventList events={events} onUpdateStatus={updateEventStatus} onDelete={deleteEvent} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;