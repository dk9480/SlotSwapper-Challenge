// src/components/EventList.jsx

import React from 'react';


const EventList = ({ events, onUpdateStatus, onDelete }) => {
    
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
        });
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            {events.length === 0 ? (
                <p style={{ 
                    color: '#888',
                    textAlign: 'center',
                    width: '100%',
                    padding: '20px'
                }}>
                    No events found. Create a new slot!
                </p>
            ) : (
                events.map(event => (
                    <div 
                        key={event._id} 
                        style={{ 
                            border: '1px solid #404040', 
                            padding: '15px', 
                            borderRadius: '10px',
                            minWidth: '280px',
                            // Allow space for multiple buttons below the text
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            background: event.status === 'SWAPPABLE' ? '#1a2a1a' : 
                                      event.status === 'SWAP_PENDING' ? '#1a1f2a' : '#2d2d2d',
                            borderLeft: event.status === 'SWAPPABLE' ? '4px solid #4CAF50' :
                                      event.status === 'SWAP_PENDING' ? '4px solid #2196F3' : '4px solid #666'
                        }}
                    >
                        {/* Event Details */}
                        <div>
                            <h4 style={{ 
                                margin: '0 0 10px 0',
                                color: '#e1e5e9',
                                fontSize: '16px',
                                fontWeight: '700'
                            }}>
                                {event.title}
                            </h4>
                            <p style={{ 
                                color: '#bbb',
                                margin: '5px 0',
                                fontSize: '13px'
                            }}>
                                <strong style={{color: '#e1e5e9'}}>Time:</strong> {formatTime(event.startTime)} - {formatTime(event.endTime)}
                            </p>
                            <p style={{ 
                                color: '#bbb',
                                margin: '5px 0 15px 0', // Added margin-bottom here
                                fontSize: '13px'
                            }}>
                                <strong style={{color: '#e1e5e9'}}>Status:</strong>{' '}
                                <span style={{ 
                                    fontWeight: 'bold', 
                                    color: event.status === 'SWAPPABLE' ? '#4CAF50' : 
                                            event.status === 'SWAP_PENDING' ? '#2196F3' : '#bbb'
                                }}>
                                    {event.status}
                                </span>
                            </p>
                        </div>
                        
                        {/* Action Buttons Container */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: 'auto' }}> 
                            {/* Status Control Button */}
                            {event.status === 'BUSY' && (
                                <button 
                                    onClick={() => onUpdateStatus(event._id, 'SWAPPABLE')}
                                    style={{ 
                                        padding: '8px 10px',
                                        background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        flexGrow: 1
                                    }}
                                    onMouseOver={(e) => { e.target.style.transform = 'translateY(-1px)'; }}
                                    onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; }}
                                >
                                    Make Swappable
                                </button>
                            )}

                            {event.status === 'SWAPPABLE' && (
                                <button 
                                    onClick={() => onUpdateStatus(event._id, 'BUSY')}
                                    style={{ 
                                        padding: '8px 10px',
                                        background: 'linear-gradient(45deg, #f44336, #da190b)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        flexGrow: 1
                                    }}
                                    onMouseOver={(e) => { e.target.style.transform = 'translateY(-1px)'; }}
                                    onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; }}
                                >
                                    Cancel Swappable
                                </button>
                            )}
                            
                            {event.status === 'SWAP_PENDING' && (
                                <p style={{ 
                                    color: '#2196F3', 
                                    fontWeight: 'bold',
                                    fontSize: '12px',
                                    padding: '8px 10px', // Matches button padding
                                    margin: 0,
                                    background: '#152535',
                                    borderRadius: '6px',
                                    flexGrow: 1,
                                    textAlign: 'center'
                                }}>
                                    Swap Pending
                                </p>
                            )}
                            
                            {/*  DELETE Button */}
                            <button 
                                // Call onDelete with ID and Title
                                onClick={() => onDelete(event._id, event.title)}
                                style={{ 
                                    padding: '8px 10px',
                                    background: 'transparent',
                                    color: '#ff6b6b',
                                    border: '1px solid #ff6b6b',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    flexGrow: 1
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
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};


export default EventList;
