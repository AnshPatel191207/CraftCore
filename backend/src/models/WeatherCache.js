const mongoose = require('mongoose');

const weatherCacheSchema = new mongoose.Schema({
  location: { 
    lat: Number, 
    lng: Number 
  },
  current: mongoose.Schema.Types.Mixed,
  forecast: mongoose.Schema.Types.Mixed,
  agriculturalAdvisory: String,
  cachedAt: { 
    type: Date, 
    default: Date.now 
  },
  expiresAt: { 
    type: Date, 
    required: true
  }
}, { timestamps: true });

// Compound index for location queries
weatherCacheSchema.index({ 'location.lat': 1, 'location.lng': 1 });

// TTL index for auto-deletion on expiry
weatherCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const WeatherCache = mongoose.model('WeatherCache', weatherCacheSchema);

module.exports = WeatherCache;
