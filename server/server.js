// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Required for frontend integration

const app = express();

// --- Middleware ---
// Allow cross-origin requests from the frontend (Vite default port)
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully! (Ensure replica set is running)'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Import Routes ---
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const swapRoutes = require('./routes/swapRoutes');

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/swaps', swapRoutes);

app.get('/', (req, res) => {
    res.send('SlotSwapper API is running.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));