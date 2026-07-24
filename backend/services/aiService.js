require('dotenv').config();

let groq = null;
try {
  const apiKey = process.env.GROQ_API_KEY;
  if (apiKey && apiKey.length > 20) {
    const Groq = require('groq-sdk');
    groq = new Groq({ apiKey: apiKey });
    console.log('Groq AI initialized - Ready!');
  } else {
    console.log('No Groq API key - using templates');
  }
} catch (error) {
  console.log('Groq init failed: ' + error.message);
}

class AIService {

  async generateItinerary(trip) {
    if (groq) {
      try {
        console.log('Generating AI itinerary for: ' + trip.destination);
        return await this.generateWithGroq(trip);
      } catch (error) {
        console.error('Groq failed: ' + error.message);
      }
    }
    return this.generateWithTemplates(trip);
  }

  async generateWithGroq(trip) {
    const prompt = 'Create a ' + trip.days + '-day travel itinerary for ' + trip.destination + '. Budget: ' + trip.budget + '. Interests: ' + trip.interests.join(', ') + '. Give SPECIFIC real activities with real locations, times, and costs in USD. Return ONLY valid JSON (no markdown, no extra text): {"itinerary":[{"day":1,"activities":[{"time":"08:00","activity":"Real activity name","location":"Real place name","cost":25}]}],"budgetEstimation":{"flights":400,"accommodation":300,"food":150,"activities":100,"total":950}}';

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a travel expert. Return ONLY valid JSON. No markdown, no explanations, JUST the JSON object." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 2000
    });

    let content = completion.choices[0].message.content.trim();
    content = content.replace(/`json\n?/g, '').replace(/`/g, '').trim();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
  }

  async suggestHotels(trip) {
    if (groq) {
      try { return await this.generateHotelsWithGroq(trip); }
      catch (e) { console.error('Hotel error: ' + e.message); }
    }
    return this.getDefaultHotels(trip);
  }

  async generateHotelsWithGroq(trip) {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Return ONLY a JSON array of 3 real hotels." },
        { role: "user", content: 'Suggest 3 real hotels in ' + trip.destination + ' for ' + trip.budget + ' budget. Return: [{"name":"Real Hotel Name","category":"Luxury/Mid-range/Budget","priceRange":"-Y/night","rating":4.5,"location":"Area"}]' }
      ],
      temperature: 0.7, max_tokens: 300
    });
    let c = completion.choices[0].message.content.trim().replace(/`json\n?|`/g, '');
    const m = c.match(/\[[\s\S]*\]/);
    return m ? JSON.parse(m[0]) : JSON.parse(c);
  }

  async generateTravelInsights(trip) {
    if (groq) {
      try { return await this.generateInsightsWithGroq(trip); }
      catch (e) { console.error('Insights error: ' + e.message); }
    }
    return this.getDefaultInsights(trip);
  }

  async generateInsightsWithGroq(trip) {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Return ONLY valid JSON." },
        { role: "user", content: 'Travel insights for ' + trip.destination + '. Return: {"bestTimeToVisit":"...","customs":"...","mustTryFoods":["...","..."],"safetyTips":["...","..."],"transportation":"...","hiddenGems":["...","..."]}' }
      ],
      temperature: 0.8, max_tokens: 400
    });
    let c = completion.choices[0].message.content.trim().replace(/`json\n?|`/g, '');
    const m = c.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : JSON.parse(c);
  }

  generateWithTemplates(trip) {
    var d = trip.destination;
    var templates = [
      [
        { time: '09:00', activity: 'Explore ' + d + ' highlights', location: 'City Center', cost: 20 },
        { time: '12:00', activity: 'Visit main attraction', location: 'Tourist Area', cost: 12 },
        { time: '14:00', activity: 'Local lunch experience', location: 'Restaurant Area', cost: 18 },
        { time: '16:00', activity: 'Cultural site visit', location: 'Cultural District', cost: 8 },
        { time: '18:00', activity: 'Market shopping', location: 'Local Market', cost: 0 },
        { time: '20:00', activity: 'Dinner at popular spot', location: 'Dining Area', cost: 25 }
      ],
      [
        { time: '08:00', activity: 'Nature exploration', location: 'Nature Area', cost: 5 },
        { time: '11:00', activity: 'Adventure activity', location: 'Outdoors', cost: 28 },
        { time: '14:00', activity: 'Cooking class', location: 'Cooking School', cost: 25 },
        { time: '17:00', activity: 'Sunset viewpoint', location: 'Scenic Point', cost: 0 },
        { time: '20:00', activity: 'Cultural dinner show', location: 'Cultural Center', cost: 30 }
      ],
      [
        { time: '07:00', activity: 'Day trip excursion', location: 'Nearby Town', cost: 35 },
        { time: '13:00', activity: 'Lunch at destination', location: 'Day Trip Site', cost: 12 },
        { time: '16:00', activity: 'Return & relaxation', location: 'Spa/Cafe', cost: 20 },
        { time: '19:00', activity: 'Farewell dinner', location: 'Fine Dining', cost: 40 }
      ]
    ];
    var itinerary = [];
    for (var i = 1; i <= trip.days; i++) {
      var t = templates[(i - 1) % templates.length];
      itinerary.push({ day: i, activities: t.map(function(a) { return { time: a.time, activity: a.activity, location: a.location, cost: Math.round(a.cost * (0.8 + Math.random() * 0.4)) }; }) });
    }
    var m = { Low: 0.6, Medium: 1, High: 1.8 }[trip.budget] || 1;
    return { itinerary: itinerary, budgetEstimation: { flights: Math.round(350 * m), accommodation: Math.round(65 * m * trip.days), food: Math.round(28 * m * trip.days), activities: Math.round(38 * m * trip.days), total: Math.round((350 + 65 * trip.days + 28 * trip.days + 38 * trip.days) * m) } };
  }

  getDefaultHotels(trip) {
    var d = trip.destination;
    return [
      { name: d + ' Grand Hotel', category: 'Luxury', priceRange: '-350/night', rating: 4.5, location: 'City Center' },
      { name: d + ' Comfort Inn', category: 'Mid-range', priceRange: '-120/night', rating: 4.1, location: 'Downtown' },
      { name: d + ' Budget Stay', category: 'Budget', priceRange: '-30/night', rating: 3.9, location: 'Central Area' }
    ];
  }

  getDefaultInsights(trip) {
    var d = trip.destination;
    return { bestTimeToVisit: 'Check best season for ' + d, customs: 'Learn local traditions', mustTryFoods: ['Local specialty', 'Street food', 'Traditional dish'], safetyTips: ['Stay aware', 'Use official transport'], transportation: 'Check local options', hiddenGems: ['Hidden spot', 'Offbeat area'] };
  }
}

module.exports = new AIService();
