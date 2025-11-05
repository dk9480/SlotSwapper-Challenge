// models/Event.js

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    // The user who currently owns this slot
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Crucial status: BUSY, SWAPPABLE, SWAP_PENDING
    status: {
        type: String,
        required: true,
        enum: ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'],
        default: 'BUSY'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);