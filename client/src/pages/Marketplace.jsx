// src/pages/Marketplace.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const Marketplace = () => {
    const navigate = useNavigate();
    const [availableSlots, setAvailableSlots] = useState([]);
    const [mySwappableSlots, setMySwappableSlots] = useState([]);
    const [selectedTheirSlot, setSelectedTheirSlot] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatTime = (dateString) => new Date(dateString).toLocaleString('en-US', { 
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true 
    });

    const fetchData = useCallback(async () => {
        try {
            const [slotsRes, mySlotsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/swaps/swappable-slots`),
                axios.get(`${API_BASE_URL}/events`), 
            ]);

            setAvailableSlots(slotsRes.data);
            setMySwappableSlots(mySlotsRes.data.filter(slot => slot.status === 'SWAPPABLE'));
            setLoading(false);
        } catch (err) {
            console.error('Error fetching data:', err);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRequestSwap = async (mySlotId, theirSlotId) => {
        try {
            await axios.post(`${API_BASE_URL}/swaps/swap-request`, {
                mySlotId, theirSlotId,
            });
            setSelectedTheirSlot(null);
            fetchData();
            alert('Swap request sent! Check your Requests page.');

        } catch (err) {
            console.error('Swap request failed:', err.response?.data?.msg || err.message);
            alert(`Swap failed: ${err.response?.data?.msg || 'An unexpected error occurred.'}`);
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
            Loading Marketplace...
        </div>
    );

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
                maxWidth: '1100px', 
                padding: '40px 35px', 
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '16px', 
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                // Force center positioning - SAME AS OTHERS
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
                            Marketplace 🛒
                        </h1>
                        <p style={{ 
                            margin: '5px 0 0 0', 
                            color: '#888',
                            fontSize: '14px'
                        }}>
                            Discover and swap slots with peers
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: '10px 20px',
                            background: 'transparent',
                            color: '#667eea',
                            border: '1px solid #667eea',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = '#667eea';
                            e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#667eea';
                        }}
                    >
                        Back to Dashboard
                    </button>
                </div>

                {/* Available Slots Section */}
                <div>
                    <h2 style={{ 
                        color: '#e1e5e9',
                        fontSize: '22px',
                        fontWeight: '700',
                        marginBottom: '20px'
                    }}>
                        Available Slots from Peers ({availableSlots.length})
                    </h2>
                    
                    {availableSlots.length === 0 ? (
                        <p style={{ 
                            color: '#888',
                            textAlign: 'center',
                            padding: '40px',
                            background: '#2d2d2d',
                            borderRadius: '12px',
                            border: '1px solid #404040'
                        }}>
                            No swappable slots available right now.
                        </p>
                    ) : (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                            gap: '20px' 
                        }}>
                            {availableSlots.map(slot => (
                                <div key={slot._id} style={{
                                    padding: '20px',
                                    background: '#2d2d2d',
                                    borderRadius: '12px',
                                    border: '1px solid #404040',
                                    borderLeft: '4px solid #FFC107',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <div>
                                        <h3 style={{ 
                                            color: '#e1e5e9',
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            margin: '0 0 10px 0'
                                        }}>
                                            {slot.title}
                                        </h3>
                                        <p style={{ color: '#bbb', margin: '5px 0', fontSize: '14px' }}>
                                            <strong style={{color: '#e1e5e9'}}>From:</strong> {slot.owner.name}
                                        </p>
                                        <p style={{ color: '#bbb', margin: '5px 0', fontSize: '14px' }}>
                                            <strong style={{color: '#e1e5e9'}}>Time:</strong> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                        </p>
                                    </div>
                                    
                                    <button 
                                        onClick={() => setSelectedTheirSlot(slot)}
                                        disabled={mySwappableSlots.length === 0}
                                        style={{
                                            padding: '12px 16px',
                                            background: mySwappableSlots.length === 0 ? '#555' : 'linear-gradient(45deg, #667eea, #764ba2)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: mySwappableSlots.length === 0 ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.3s ease',
                                            marginTop: '15px'
                                        }}
                                        onMouseOver={(e) => {
                                            if (mySwappableSlots.length > 0) {
                                                e.target.style.transform = 'translateY(-2px)';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (mySwappableSlots.length > 0) {
                                                e.target.style.transform = 'translateY(0)';
                                            }
                                        }}
                                    >
                                        Request Swap
                                    </button>
                                    {mySwappableSlots.length === 0 && (
                                        <p style={{
                                            color: '#ff6b6b', 
                                            fontSize: '12px', 
                                            marginTop: '10px',
                                            textAlign: 'center'
                                        }}>
                                            *You must have a SWAPPABLE slot to offer a trade.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Swap Selection Modal */}
                {selectedTheirSlot && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}>
                        <div style={{ 
                            background: '#1a1a1a', 
                            padding: '30px', 
                            borderRadius: '16px', 
                            minWidth: '500px',
                            maxWidth: '600px',
                            color: 'white', 
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                            border: '1px solid #333',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <h3 style={{
                                margin: '0 0 20px 0',
                                fontSize: '22px',
                                fontWeight: '700',
                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                Offer Your Slot for: {selectedTheirSlot.title}
                            </h3>
                            
                            <p style={{ color: '#bbb', marginBottom: '20px' }}>
                                Time: {formatTime(selectedTheirSlot.startTime)} - {formatTime(selectedTheirSlot.endTime)}
                            </p>
                            
                            <p style={{ 
                                borderTop: '1px solid #333', 
                                paddingTop: '15px', 
                                fontWeight: '700',
                                color: '#e1e5e9',
                                marginBottom: '15px'
                            }}>
                                Your Slots to Offer (Status: SWAPPABLE):
                            </p>
                            
                            {mySwappableSlots.map(mySlot => (
                                <div key={mySlot._id} style={{
                                    border: '1px solid #404040',
                                    padding: '15px',
                                    margin: '10px 0',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: '#2d2d2d'
                                }}>
                                    <span style={{ color: '#e1e5e9', fontSize: '14px' }}>
                                        {mySlot.title} ({formatTime(mySlot.startTime)})
                                    </span>
                                    <button 
                                        onClick={() => handleRequestSwap(mySlot._id, selectedTheirSlot._id)}
                                        style={{
                                            padding: '8px 16px',
                                            background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        Offer This Slot
                                    </button>
                                </div>
                            ))}
                            
                            <button 
                                onClick={() => setSelectedTheirSlot(null)} 
                                style={{
                                    padding: '12px 24px',
                                    background: 'transparent',
                                    color: '#ff6b6b',
                                    border: '1px solid #ff6b6b',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'block',
                                    margin: '20px auto 0',
                                    width: '100%'
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
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;