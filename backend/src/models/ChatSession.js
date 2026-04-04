const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  domain: { 
    type: String, 
    enum: ['AgriTech', 'FinTech', 'Health', 'EdTech', 'Civic'],
    default: 'AgriTech'
  },
  title: { 
    type: String, 
    default: 'New Chat' 
  },
  messages: [{
    role: { 
      type: String, 
      enum: ['user', 'ai'], 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    timestamp: { 
      type: Date, 
      default: Date.now 
    },
    sources: [String]
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

module.exports = ChatSession;
