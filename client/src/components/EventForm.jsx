// src/components/EventForm.jsx
import React, { useState } from 'react';

const EventForm = ({ onCreate }) => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate({ title, startTime, endTime }); 
        setTitle('');
        setStartTime('');
        setEndTime('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px'
        }}>
            <input 
                type="text" 
                placeholder="Title (e.g., Focus Block)" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                style={{
                    padding: '10px 12px',
                    background: '#1a1a1a',
                    border: '1px solid #404040',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#ffffff',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '#404040';
                    e.target.style.boxShadow = 'none';
                }}
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{
                    color: '#e1e5e9',
                    fontSize: '13px',
                    fontWeight: '600'
                }}>
                    Start Time:
                </label>
                <input 
                    type="datetime-local" 
                    value={startTime} 
                    onChange={(e) => setStartTime(e.target.value)} 
                    required 
                    style={{
                        padding: '10px 12px',
                        background: '#1a1a1a',
                        border: '1px solid #404040',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#ffffff',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = '#404040';
                        e.target.style.boxShadow = 'none';
                    }}
                />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{
                    color: '#e1e5e9',
                    fontSize: '13px',
                    fontWeight: '600'
                }}>
                    End Time:
                </label>
                <input 
                    type="datetime-local" 
                    value={endTime} 
                    onChange={(e) => setEndTime(e.target.value)} 
                    required 
                    style={{
                        padding: '10px 12px',
                        background: '#1a1a1a',
                        border: '1px solid #404040',
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#ffffff',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = '#404040';
                        e.target.style.boxShadow = 'none';
                    }}
                />
            </div>
            
            <button 
                type="submit"
                style={{
                    padding: '10px 12px',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: '5px'
                }}
                onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                }}
            >
                Add Slot
            </button>
        </form>
    );
};

export default EventForm;