const express = require('express');
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');

const router = express.Router();
router.use(auth);

router.get('/trip/:tripId/convert', async (req, res) => {
  try {
    const trip = await Trip.findOne({ 
      _id: req.params.tripId, 
      user: req.userId 
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (!trip.budgetEstimation || !trip.budgetEstimation.total) {
      return res.status(400).json({ error: 'No budget estimation available' });
    }

    const targetCurrency = (req.query.to || 'USD').toUpperCase();
    
    // Simple exchange rates
    const rates = {
      USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, JPY: 150, AUD: 1.53, CAD: 1.36
    };
    
    const rate = rates[targetCurrency] || 1;
    
    res.json({
      destination: trip.destination,
      localCurrency: 'USD',
      localCurrencySymbol: '$',
      targetCurrency,
      targetCurrencySymbol: targetCurrency === 'INR' ? '₹' : targetCurrency === 'EUR' ? '€' : targetCurrency === 'GBP' ? '£' : '$',
      originalBudget: trip.budgetEstimation,
      convertedBudget: {
        flights: Math.round(trip.budgetEstimation.flights * rate),
        accommodation: Math.round(trip.budgetEstimation.accommodation * rate),
        food: Math.round(trip.budgetEstimation.food * rate),
        activities: Math.round(trip.budgetEstimation.activities * rate),
        total: Math.round(trip.budgetEstimation.total * rate),
        exchangeRate: rate,
        conversionNote: 'Converted at approximate rate'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
