// src/pages/RequestsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const RequestsPage = () => {
    const navigate = useNavigate();
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    // State for custom feedback/alerts
    const [feedback, setFeedback] = useState(null); // { message, type: 'success' | 'error' }
    // State for custom confirmation modal
    const [confirmAction, setConfirmAction] = useState(null); // { requestId, isAccepted, message }

    const formatTime = (dateString) => new Date(dateString).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
    });

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            setFeedback(null);
            const [incomingRes, outgoingRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/swaps/incoming`),
                axios.get(`${API_BASE_URL}/swaps/outgoing`),
            ]);

            setIncomingRequests(incomingRes.data);
            setOutgoingRequests(outgoingRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching requests:', err);
            setFeedback({ message: 'Failed to fetch swap requests.', type: 'error' });
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // Step 1: Trigger confirmation modal (replaces window.confirm)
    const handleConfirmRequest = (requestId, isAccepted) => {
        setFeedback(null);
        const action = isAccepted ? 'accept' : 'reject';
        const message = `Are you sure you want to ${action} this swap? This action is irreversible.`;
        setConfirmAction({ requestId, isAccepted, message });
    };

    // Step 2: Execute swap action (replaces backend logic after confirm)
    const executeSwapResponse = async () => {
        if (!confirmAction) return;

        const { requestId, isAccepted } = confirmAction;
        setConfirmAction(null); // Clear modal immediately

        const action = isAccepted ? 'Accepting' : 'Rejecting';

        try {
            await axios.post(`${API_BASE_URL}/swaps/swap-response/${requestId}`, {
                isAccepted,
            });
            
            setFeedback({ 
                message: `Swap successfully ${isAccepted ? 'accepted' : 'rejected'}! Your calendar has been updated.`, 
                type: 'success' 
            });
            fetchRequests(); 
            // navigate('/dashboard'); // Keep the user on this page to see status updates

        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'An unexpected error occurred.';
            console.error(`Error ${action} swap:`, errorMsg);
            setFeedback({ 
                message: `Failed to ${action.toLowerCase()} swap: ${errorMsg}`, 
                type: 'error' 
            });
        }
    };
    
    // UI Component for the Feedback/Alert Message (Replaces alert())
    const FeedbackMessage = ({ message, type }) => {
        const bgColor = type === 'success' ? '#4CAF50' : '#F44336';
        const icon = type === 'success' ? '✔' : '❌';
        
        if (!message) return null;

        return (
            <div style={{
                padding: '12px 20px',
                backgroundColor: bgColor,
                color: 'white',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}>
                <span style={{ fontWeight: '600' }}>{icon} {message}</span>
                <button 
                    onClick={() => setFeedback(null)} 
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '18px',
                        cursor: 'pointer',
                        marginLeft: '15px'
                    }}
                >
                    &times;
                </button>
            </div>
        );
    };

    // UI Component for the Confirmation Modal (Replaces window.confirm)
    const ConfirmationModal = () => {
        if (!confirmAction) return null;

        return (
            <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: '#1a1a1a',
                    padding: '30px',
                    borderRadius: '12px',
                    width: '350px',
                    textAlign: 'center',
                    border: '1px solid #404040',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
                }}>
                    <h3 style={{ color: '#e1e5e9', margin: '0 0 15px 0' }}>Confirm Swap Action</h3>
                    <p style={{ color: '#bbb', margin: '0 0 30px 0' }}>{confirmAction.message}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-around', gap: '15px' }}>
                        <button 
                            onClick={executeSwapResponse}
                            style={{
                                padding: '10px 20px',
                                background: confirmAction.isAccepted ? '#4CAF50' : '#F44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                flexGrow: 1
                            }}
                        >
                            {confirmAction.isAccepted ? 'Accept Swap' : 'Reject Swap'}
                        </button>
                        <button 
                            onClick={() => setConfirmAction(null)}
                            style={{
                                padding: '10px 20px',
                                background: '#404040',
                                color: '#bbb',
                                border: '1px solid #555',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                flexGrow: 1
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
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
            Loading Requests...
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
            <ConfirmationModal />
            <div style={{ 
                width: '100%',
                maxWidth: '1000px', 
                padding: '40px 35px', 
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '16px', 
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
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
                            Swap Requests & Notifications 🔔
                        </h1>
                        <p style={{ 
                            margin: '5px 0 0 0', 
                            color: '#888',
                            fontSize: '14px'
                        }}>
                            Manage your incoming and outgoing swap requests
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
                
                <FeedbackMessage message={feedback?.message} type={feedback?.type} />

                {/* Incoming Requests */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ 
                        color: '#e1e5e9',
                        fontSize: '22px',
                        fontWeight: '700',
                        marginBottom: '20px'
                    }}>
                        Incoming Requests ({incomingRequests.length})
                    </h2>
                    
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {incomingRequests.length === 0 ? (
                            <p style={{ 
                                color: '#888',
                                textAlign: 'center',
                                padding: '30px',
                                background: '#2d2d2d',
                                borderRadius: '8px',
                                border: '1px solid #404040'
                            }}>
                                You have no pending incoming swap requests.
                            </p>
                        ) : (
                            incomingRequests.map(req => (
                                <div key={req._id} style={{
                                    padding: '20px',
                                    background: '#2d2d2d',
                                    borderRadius: '12px',
                                    border: '1px solid #404040',
                                    borderLeft: '4px solid #FF9800'
                                }}>
                                    <p style={{ 
                                        color: '#e1e5e9',
                                        fontWeight: '700',
                                        fontSize: '16px',
                                        margin: '0 0 15px 0'
                                    }}>
                                        Action Required: Request from <span style={{color: '#667eea'}}>{req.requester?.name || 'Unknown User'}</span>
                                    </p>
                                    
                                    <div style={{ marginBottom: '15px' }}>
                                        <p style={{ color: '#bbb', margin: '5px 0', fontSize: '14px' }}>
                                            <strong style={{color: '#e1e5e9'}}>THEY WANT (Your Slot):</strong> {req.desiredSlot?.title || 'Slot Missing'} ({formatTime(req.desiredSlot?.startTime)})
                                        </p>
                                        <p style={{ color: '#bbb', margin: '5px 0', fontSize: '14px' }}>
                                            <strong style={{color: '#e1e5e9'}}>THEY OFFER (Their Slot):</strong> {req.offeredSlot?.title || 'Slot Missing'} ({formatTime(req.offeredSlot?.startTime)})
                                        </p>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button 
                                            onClick={() => handleConfirmRequest(req._id, true)}
                                            style={{
                                                padding: '10px 20px',
                                                background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '14px',
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
                                            ✅ Accept
                                        </button>
                                        <button 
                                            onClick={() => handleConfirmRequest(req._id, false)}
                                            style={{
                                                padding: '10px 20px',
                                                background: 'linear-gradient(45deg, #F44336, #da190b)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '14px',
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
                                            ❌ Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Outgoing Requests */}
                <div>
                    <h2 style={{ 
                        color: '#e1e5e9',
                        fontSize: '22px',
                        fontWeight: '700',
                        marginBottom: '20px'
                    }}>
                        Outgoing Requests ({outgoingRequests.length})
                    </h2>
                    
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {outgoingRequests.length === 0 ? (
                            <p style={{ 
                                color: '#888',
                                textAlign: 'center',
                                padding: '30px',
                                background: '#2d2d2d',
                                borderRadius: '8px',
                                border: '1px solid #404040'
                            }}>
                                You have no outgoing swap requests.
                            </p>
                        ) : (
                            outgoingRequests.map(req => (
                                <div key={req._id} style={{
                                    padding: '20px',
                                    background: '#2d2d2d',
                                    borderRadius: '12px',
                                    border: '1px solid #404040',
                                    borderLeft: '4px solid #667eea'
                                }}>
                                    <p style={{ 
                                        color: '#e1e5e9',
                                        fontWeight: '700',
                                        fontSize: '16px',
                                        margin: '0 0 10px 0'
                                    }}>
                                        Sent to: <span style={{color: '#667eea'}}>{req.recipient?.name || 'Unknown Recipient'}</span>
                                    </p>
                                    
                                    <p style={{ color: '#bbb', margin: '5px 0', fontSize: '14px' }}>
                                        <strong style={{color: '#e1e5e9'}}>Requested Slot:</strong> {req.desiredSlot?.title || 'Slot Missing'} ({formatTime(req.desiredSlot?.startTime)})
                                    </p>
                                    <p style={{ color: '#bbb', margin: '5px 0', fontSize: '14px' }}>
                                        <strong style={{color: '#e1e5e9'}}>Your Offered Slot:</strong> {req.offeredSlot?.title || 'Slot Missing'} ({formatTime(req.offeredSlot?.startTime)})
                                    </p>
                                    <p style={{ color: '#bbb', margin: '5px 0', fontSize: '14px' }}>
                                        <strong style={{color: '#e1e5e9'}}>Status:</strong>{' '}
                                        <span style={{
                                            color: req.status === 'ACCEPTED' ? '#4CAF50' : 
                                                    req.status === 'REJECTED' ? '#F44336' : '#FF9800',
                                            fontWeight: '700'
                                        }}>
                                            {req.status}
                                        </span>
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestsPage;