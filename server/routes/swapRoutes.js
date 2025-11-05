// routes/swapRoutes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');

// GET /api/swaps/incoming - Get requests sent to the logged-in user
router.get('/incoming', auth, async (req, res) => {
    try {
        const requests = await SwapRequest.find({ recipient: req.user.id, status: 'PENDING' })
        .populate('requester', 'name email')
        .populate('offeredSlot', 'title startTime endTime')
        .populate('desiredSlot', 'title startTime endTime')
        .sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) { res.status(500).send('Server error'); }
});

// GET /api/swaps/outgoing - Get requests sent by the logged-in user
router.get('/outgoing', auth, async (req, res) => {
    try {
        const requests = await SwapRequest.find({ requester: req.user.id })
        .populate('recipient', 'name email')
        .populate('offeredSlot', 'title startTime endTime')
        .populate('desiredSlot', 'title startTime endTime')
        .sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) { res.status(500).send('Server error'); }
});

// GET /api/swaps/swappable-slots - The Marketplace
router.get('/swappable-slots', auth, async (req, res) => {
    try {
        const slots = await Event.find({
            owner: { $ne: req.user.id },
            status: 'SWAPPABLE'
        }).populate('owner', 'name email');
        res.json(slots);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// POST /api/swaps/swap-request - Initiate a swap
router.post('/swap-request', auth, async (req, res) => {
    const { mySlotId, theirSlotId } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const mySlot = await Event.findById(mySlotId).session(session);
        const theirSlot = await Event.findById(theirSlotId).session(session);

        if (!mySlot || !theirSlot) throw new Error('One or both slots not found');
        if (mySlot.owner.toString() !== req.user.id) throw new Error('Offered slot does not belong to user.');
        if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') throw new Error('Both slots must be SWAPPABLE.');

        const newRequest = new SwapRequest({
            requester: req.user.id,
            recipient: theirSlot.owner,
            offeredSlot: mySlotId,
            desiredSlot: theirSlotId,
        });
        await newRequest.save({ session });

        await Event.findByIdAndUpdate(mySlotId, { status: 'SWAP_PENDING' }, { session });
        await Event.findByIdAndUpdate(theirSlotId, { status: 'SWAP_PENDING' }, { session });

        await session.commitTransaction();
        session.endSession();
        res.json({ msg: 'Swap request sent successfully.', requestId: newRequest._id });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ msg: err.message || 'Error processing swap request' });
    }
});

// POST /api/swaps/swap-response/:requestId - Accept/Reject a swap
router.post('/swap-response/:requestId', auth, async (req, res) => {
    const { isAccepted } = req.body;
    const { requestId } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const request = await SwapRequest.findById(requestId).session(session);

        if (!request) throw new Error('Swap request not found.');
        if (request.recipient.toString() !== req.user.id) throw new Error('Unauthorized to respond.');
        if (request.status !== 'PENDING') throw new Error(`Request has already been ${request.status}.`);

        const offeredSlot = await Event.findById(request.offeredSlot).session(session);
        const desiredSlot = await Event.findById(request.desiredSlot).session(session);
        
        if (!offeredSlot || !desiredSlot) throw new Error('Slots involved in the request are missing.');

        if (isAccepted) {
            // --- ACCEPTED: Atomic Swap of Ownership ---
            
            // 1. Swap owners
            desiredSlot.owner = request.requester;
            offeredSlot.owner = request.recipient;

            // 2. Set new status to BUSY
            desiredSlot.status = 'BUSY';
            offeredSlot.status = 'BUSY';

            await offeredSlot.save({ session });
            await desiredSlot.save({ session });
            
            // 3. Update request status
            request.status = 'ACCEPTED';
            await request.save({ session });

        } else {
            // --- REJECTED: Revert Statuses ---
            request.status = 'REJECTED';
            await request.save({ session });

            if (offeredSlot.status === 'SWAP_PENDING') {
                await Event.findByIdAndUpdate(request.offeredSlot, { status: 'SWAPPABLE' }, { session });
            }
            if (desiredSlot.status === 'SWAP_PENDING') {
                 await Event.findByIdAndUpdate(request.desiredSlot, { status: 'SWAPPABLE' }, { session });
            }
        }

        await session.commitTransaction();
        session.endSession();
        res.json({ msg: `Swap request ${isAccepted ? 'accepted' : 'rejected'} successfully.`, request });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ msg: err.message || 'Error processing swap response' });
    }
});

module.exports = router;