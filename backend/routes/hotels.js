const express = require('express');
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');
const aiService = require('../services/aiService');

const router = express.Router();
router.use(auth);

router.get('/:tripId', async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.tripId, user: req.userId });
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  const hotels = await aiService.suggestHotels(trip);
  res.json({ hotels });
});

router.get('/:tripId/insights', async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.tripId, user: req.userId });
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  const insights = await aiService.generateTravelInsights(trip);
  res.json({ insights });
});

module.exports = router;
