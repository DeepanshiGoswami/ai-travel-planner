class PromptBuilder {
  static buildItineraryPrompt(trip) {
    return {
      system: "You are an expert travel planner. Create detailed, realistic itineraries.",
      user: `Create a ${trip.days}-day itinerary for ${trip.destination}.
Budget: ${trip.budget}
Interests: ${trip.interests.join(', ')}
Include specific times, locations, and estimated costs.`
    };
  }

  static buildHotelPrompt(trip) {
    return {
      system: "You are a hotel recommendation expert.",
      user: `Suggest hotels in ${trip.destination} for ${trip.budget} budget travelers.
Include name, category, price range, rating, and location.`
    };
  }
}

module.exports = PromptBuilder;