const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  area: { 
    type: Number, 
    required: true, 
    min: 0.1 
  },
  health: { 
    type: Number, 
    min: 0, 
    max: 100, 
    default: 100 
  },
  stage: { 
    type: String, 
    required: true 
  },
  plantedDate: { 
    type: Date, 
    required: true 
  },
  expectedHarvest: { 
    type: Date, 
    required: true 
  },
  healthHistory: [{ 
    date: { 
      type: Date, 
      default: Date.now 
    }, 
    health: Number, 
    notes: String 
  }],
  variety: String,
  fieldLocation: String,
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop;
