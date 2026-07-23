const aiService = require('./aiService');

class HotelService {
  async getHotelSuggestions(trip) {
    try {
      const hotels = await aiService.suggestHotels(trip);
      return this.categorizeHotels(hotels);
    } catch (error) {
      console.error('Hotel service error:', error);
      return [];
    }
  }

  categorizeHotels(hotels) {
    return hotels.map(hotel => ({
      ...hotel,
      amenities: this.suggestAmenities(hotel.category),
      bookingLink: this.generateBookingLink(hotel.name)
    }));
  }

  suggestAmenities(category) {
    const amenities = {
      'Budget': ['Free WiFi', 'Breakfast included'],
      'Mid-range': ['Free WiFi', 'Pool', 'Gym', 'Restaurant'],
      'Luxury': ['Free WiFi', 'Pool', 'Spa', 'Fine dining', 'Concierge']
    };
    return amenities[category] || amenities['Mid-range'];
  }

  generateBookingLink(hotelName) {
    const query = encodeURIComponent(hotelName);
    return `https://www.booking.com/searchresults.html?ss=${query}`;
  }
}

module.exports = new HotelService();