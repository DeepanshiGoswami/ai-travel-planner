const express = require('express');
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  const trips = await Trip.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json({ trips });
});

router.post('/', async (req, res) => {
  const trip = new Trip({ user: req.userId, ...req.body });
  await trip.save();
  res.status(201).json({ trip });
});

router.get('/:id', async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.userId });
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  res.json({ trip });
});

router.delete('/:id', async (req, res) => {
  await Trip.findOneAndDelete({ _id: req.params.id, user: req.userId });
  res.json({ message: 'Trip deleted' });
});

module.exports = router;
