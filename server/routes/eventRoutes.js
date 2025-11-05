// routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// POST /api/events - Create new event
router.post('/', auth, async (req, res) => {
    const { title, startTime, endTime, status } = req.body;
    try {
        const newEvent = new Event({
            title, startTime, endTime, owner: req.user.id, status: status || 'BUSY'
        });
        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET /api/events - Get user's events
router.get('/', auth, async (req, res) => {
    try {
        const events = await Event.find({ owner: req.user.id }).sort({ startTime: 1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PUT /api/events/:id - Update event status (e.g., to SWAPPABLE)
router.put('/:id', auth, async (req, res) => {
    const { title, startTime, endTime, status } = req.body;
    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });
        if (event.owner.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (startTime) updatedFields.startTime = startTime;
        if (endTime) updatedFields.endTime = endTime;
        if (status) updatedFields.status = status;

        event = await Event.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true });
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// DELETE /api/events/:id - Delete event
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });
        if (event.owner.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

        await Event.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;