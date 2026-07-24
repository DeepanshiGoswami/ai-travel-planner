const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ trips });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

router.post('/', [
  body('destination').trim().notEmpty().withMessage('Destination is required'),
  body('origin').optional().trim(),
  body('homeCurrency').optional().trim(),
  body('days').isInt({ min: 1, max: 30 }).withMessage('Days must be 1-30'),
  body('budget').isIn(['Low', 'Medium', 'High']).withMessage('Invalid budget'),
  body('interests').isArray({ min: 1 }).withMessage('Select at least one interest')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const trip = new Trip({
      user: req.userId,
      destination: req.body.destination,
      origin: req.body.origin || '',
      homeCurrency: req.body.homeCurrency || 'USD',
      days: req.body.days,
      budget: req.body.budget,
      interests: req.body.interests
    });

    await trip.save();
    res.status(201).json({ trip });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.userId });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json({ trip });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updates = {};
    ['destination', 'origin', 'homeCurrency', 'days', 'budget', 'interests'].forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json({ trip });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Trip.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: 'Trip deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

module.exports = router;
