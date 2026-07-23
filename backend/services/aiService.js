class AIService {
  async generateItinerary(trip) {
    var itinerary = [];
    for (var i = 1; i <= trip.days; i++) {
      itinerary.push({
        day: i,
        activities: [
          { time: '09:00', activity: 'Explore ' + trip.destination + ' - Morning tour', location: 'City Center', cost: 20 },
          { time: '12:00', activity: 'Lunch at local restaurant', location: 'Downtown', cost: 25 },
          { time: '14:00', activity: (trip.interests[0] || 'Sightseeing') + ' activity', location: 'Various', cost: 30 },
          { time: '18:00', activity: 'Dinner and evening walk', location: 'Old Town', cost: 40 }
        ]
      });
    }

    var multiplier = { Low: 0.5, Medium: 1, High: 2 }[trip.budget] || 1;
    
    return {
      itinerary: itinerary,
      budgetEstimation: {
        flights: Math.round(400 * multiplier),
        accommodation: Math.round(100 * multiplier * trip.days),
        food: Math.round(50 * multiplier * trip.days),
        activities: Math.round(40 * multiplier * trip.days),
        total: Math.round((400 + 100 * trip.days + 50 * trip.days + 40 * trip.days) * multiplier)
      }
    };
  }

  async suggestHotels(trip) {
    return [
      { name: trip.destination + ' Grand Hotel', category: 'Luxury', priceRange: '200-400/night', rating: 4.8, location: 'City Center' },
      { name: trip.destination + ' Comfort Inn', category: 'Mid-range', priceRange: '80-150/night', rating: 4.2, location: 'Downtown' },
      { name: trip.destination + ' Budget Stay', category: 'Budget', priceRange: '30-60/night', rating: 3.8, location: 'Near Station' }
    ];
  }

  async generateTravelInsights(trip) {
    return {
      bestTimeToVisit: 'Spring (March-May) and Fall (September-November)',
      customs: 'Respect local traditions in ' + trip.destination,
      mustTryFoods: ['Local street food', 'Traditional dish', 'Popular dessert'],
      safetyTips: ['Keep valuables secure', 'Use official transportation'],
      transportation: 'Public transit is efficient and affordable',
      hiddenGems: ['Local market', 'Secret viewpoint', 'Neighborhood cafe']
    };
  }
}

module.exports = new AIService();
