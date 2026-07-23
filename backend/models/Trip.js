const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  time: String,
  activity: String,
  location: String,
  cost: {
    type: Number,
    default: 0
  }
});

const daySchema = new mongoose.Schema({
  day: Number,
  activities: [activitySchema]
});

const budgetSchema = new mongoose.Schema({
  flights: { type: Number, default: 0 },
  accommodation: { type: Number, default: 0 },
  food: { type: Number, default: 0 },
  activities: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
});

const hotelSchema = new mongoose.Schema({
  name: String,
  category: String,
  priceRange: String,
  rating: Number,
  location: String
});

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  days: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },
  budget: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High']
  },
  interests: [{
    type: String,
    enum: ['Food', 'Culture', 'Adventure', 'Shopping', 'Nature', 'Relaxation']
  }],
  itinerary: [daySchema],
  budgetEstimation: budgetSchema,
  hotelSuggestions: [hotelSchema],
  travelInsights: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['draft', 'generating', 'generated', 'modified', 'error'],
    default: 'draft'
  }
}, {
  timestamps: true
});

tripSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Trip', tripSchema);