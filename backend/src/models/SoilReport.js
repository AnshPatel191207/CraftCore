const mongoose = require('mongoose');

const soilReportSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  fileName: { 
    type: String, 
    required: true 
  },
  fileUrl: { 
    type: String, 
    required: true 
  },
  fileType: { 
    type: String, 
    enum: ['pdf', 'png', 'jpg', 'jpeg'], 
    required: true 
  },
  uploadDate: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['processing', 'complete', 'error'], 
    default: 'processing' 
  },
  results: {
    ph: { 
      type: Number, 
      min: 0, max: 14 
    },
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    organicMatter: Number,
    moisture: Number,
    texture: { 
      type: String, 
      enum: ['Sandy', 'Loamy', 'Clay', 'Sandy Loam', 'Silt Loam', 'Silty Clay'] 
    },
    healthScore: { 
      type: Number, 
      min: 0, 
      max: 100 
    },
    recommendations: [String],
    micronutrients: { 
      zinc: Number, 
      iron: Number, 
      manganese: Number, 
      copper: Number 
    }
  },
  rawExtractedText: String,
  processingStartedAt: Date,
  processingCompletedAt: Date,
  errorMessage: String
}, { timestamps: true });

const SoilReport = mongoose.model('SoilReport', soilReportSchema);

module.exports = SoilReport;
