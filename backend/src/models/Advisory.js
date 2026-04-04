const mongoose = require('mongoose');

const advisorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    index: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['pest', 'weather', 'crop', 'soil', 'market']
  },
  severity: { 
    type: String, 
    required: true,
    enum: ['low', 'medium', 'high', 'critical']
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  summary: { 
    type: String, 
    required: true 
  },
  details: { 
    type: String, 
    required: true 
  },
  actionItems: [String],
  isRead: { 
    type: Boolean, 
    default: false 
  },
  readAt: Date,
  source: { 
    type: String, 
    enum: ['ai', 'admin', 'system'], 
    default: 'ai' 
  },
  relatedReportId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SoilReport' 
  },
  isGlobal: { 
    type: Boolean, 
    default: false 
  },
  targetLocation: { 
    state: String, 
    district: String 
  }
}, { timestamps: true });

const Advisory = mongoose.model('Advisory', advisorySchema);

module.exports = Advisory;
