const express = require('express');
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');
const aiService = require('../services/aiService');

const router = express.Router();
router.use(auth);

router.post('/:tripId/generate', async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, user: req.userId });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    trip.status = 'generating';
    await trip.save();

    const aiResponse = await aiService.generateItinerary(trip);
    trip.itinerary = aiResponse.itinerary;
    trip.budgetEstimation = aiResponse.budgetEstimation;
    trip.status = 'generated';
    await trip.save();

    const hotels = await aiService.suggestHotels(trip);
    trip.hotelSuggestions = hotels;
    
    const insights = await aiService.generateTravelInsights(trip);
    trip.travelInsights = insights;
    await trip.save();

    res.json({ trip });
  } catch (error) {
    console.error('Generate error:', error);
    await Trip.findOneAndUpdate(
      { _id: req.params.tripId },
      { status: 'error' }
    );
    res.status(500).json({ error: 'Failed to generate: ' + error.message });
  }
});

router.post('/:tripId/day/:dayNumber/activity', async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, user: req.userId });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const dayNum = parseInt(req.params.dayNumber);
    let day = trip.itinerary.find(d => d.day === dayNum);
    if (!day) {
      day = { day: dayNum, activities: [] };
      trip.itinerary.push(day);
    }
    day.activities.push(req.body);
    trip.status = 'modified';
    await trip.save();
    res.json({ trip });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:tripId/day/:dayNumber/activity/:activityIndex', async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, user: req.userId });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    const day = trip.itinerary.find(d => d.day === parseInt(req.params.dayNumber));
    if (day) {
      day.activities.splice(parseInt(req.params.activityIndex), 1);
      trip.status = 'modified';
      await trip.save();
    }
    res.json({ trip });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
