// src/pages/LoginPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // This runs AFTER the component renders, resolving the sync update conflict.
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Disable form while submitting
        const formButton = e.target.querySelector('button[type="submit"]');
        formButton.disabled = true;

        const success = await login(email, password);

        if (success) {
            // Navigation will be handled by the useEffect on the next render cycle, 
            // but we call it here for immediate UX when the user clicks 'Log In'.
            navigate('/dashboard'); 
        } else {
            setError('Login failed. Check credentials.');
            formButton.disabled = false;
        }
    };

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
                maxWidth: '450px', 
                padding: '50px 40px', 
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '16px', 
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                // Force center positioning
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <h2 style={{ 
                        color: '#ffffff',
                        fontSize: '32px',
                        fontWeight: '700',
                        margin: '0 0 8px 0',
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        SlotSwapper
                    </h2>
                    <p style={{
                        color: '#888',
                        fontSize: '16px',
                        margin: 0,
                        fontWeight: '500'
                    }}>
                        Welcome back
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {error && <div style={{ 
                        color: '#ff6b6b', 
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        textAlign: 'center',
                        border: '1px solid rgba(255, 107, 107, 0.2)'
                    }}>
                        {error}
                    </div>}
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{
                            color: '#e1e5e9',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            Email
                        </label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={{
                                padding: '16px 18px',
                                background: '#2d2d2d',
                                border: '1px solid #404040',
                                borderRadius: '10px',
                                fontSize: '15px',
                                color: '#ffffff',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#404040';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{
                            color: '#e1e5e9',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            Password
                        </label>
                        <input 
                            type="password" 
                            placeholder="Enter your password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={{
                                padding: '16px 18px',
                                background: '#2d2d2d',
                                border: '1px solid #404040',
                                borderRadius: '10px',
                                fontSize: '15px',
                                color: '#ffffff',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
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
                            padding: '16px 24px',
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            marginTop: '15px',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                            width: '100%'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                        }}
                    >
                        Log In
                    </button>
                </form>

                <div style={{ 
                    marginTop: '30px', 
                    textAlign: 'center',
                    paddingTop: '25px',
                    borderTop: '1px solid #333'
                }}>
                    <p style={{ 
                        color: '#888',
                        fontSize: '14px',
                        margin: '0'
                    }}>
                        Don't have an account?{' '}
                        <Link 
                            to="/signup" 
                            style={{ 
                                color: '#667eea', 
                                textDecoration: 'none',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.color = '#764ba2';
                                e.target.style.textDecoration = 'underline';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.color = '#667eea';
                                e.target.style.textDecoration = 'none';
                            }}
                        >
                            Sign Up Now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;