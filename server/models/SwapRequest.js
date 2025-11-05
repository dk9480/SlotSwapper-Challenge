// models/SwapRequest.js

const mongoose = require('mongoose');

const SwapRequestSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offeredSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    desiredSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    // Status: PENDING, ACCEPTED, REJECTED
    status: {
        type: String,
        required: true,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SwapRequest', SwapRequestSchema);