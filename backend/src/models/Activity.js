const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  action: { 
    type: String, 
    required: true 
  },
  details: { 
    type: mongoose.Schema.Types.Mixed 
  },
  ipAddress: String,
  userAgent: String,
  location: { 
    address: String, 
    lat: Number, 
    lng: Number 
  }
}, { timestamps: true });

// TTL index for 90 days (7776000 seconds)
activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
