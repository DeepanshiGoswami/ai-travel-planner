class BudgetService {
  calculateBudget(trip, itinerary) {
    const costs = {
      flights: this.estimateFlights(trip.destination, trip.budget),
      accommodation: this.estimateAccommodation(trip.days, trip.budget),
      food: this.estimateFood(trip.days, trip.budget),
      activities: this.sumActivityCosts(itinerary)
    };
    
    costs.total = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    return costs;
  }

  estimateFlights(destination, budget) {
    const multipliers = { Low: 200, Medium: 400, High: 800 };
    return multipliers[budget] || 400;
  }

  estimateAccommodation(days, budget) {
    const dailyRates = { Low: 50, Medium: 100, High: 200 };
    return (dailyRates[budget] || 100) * days;
  }

  estimateFood(days, budget) {
    const dailyRates = { Low: 20, Medium: 40, High: 80 };
    return (dailyRates[budget] || 40) * days;
  }

  sumActivityCosts(itinerary) {
    let total = 0;
    itinerary?.forEach(day => {
      day.activities?.forEach(activity => {
        total += activity.cost || 0;
      });
    });
    return total;
  }
}

module.exports = new BudgetService();