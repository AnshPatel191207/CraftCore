const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    select: false,
    required: function() { return !this.googleId; }
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  googleId: { 
    type: String, 
    sparse: true,
    index: true
  },
  avatar: String,
  farmName: { 
    type: String, 
    default: '' 
  },
  totalAcres: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  location: {
    address: String,
    lat: Number,
    lng: Number,
    state: String,
    district: String,
    city: String
  },
  currentDomain: { 
    type: String, 
    enum: ['AgriTech', 'FinTech', 'Health', 'EdTech', 'Civic'],
    default: 'AgriTech'
  },
  notificationPrefs: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    categories: [{ 
      type: String, 
      enum: ['pest', 'weather', 'crop', 'soil', 'market'] 
    }]
  },
  role: { 
    type: String, 
    enum: ['farmer', 'admin'], 
    default: 'farmer' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: Date,
  refreshTokens: [{ 
    token: String, 
    createdAt: { type: Date, default: Date.now } 
  }]
}, { timestamps: true });

// Pre-save hook for password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidate) {
  return await bcrypt.compare(candidate, this.password);
};

userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { _id: this._id, role: this.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '24h' }
  );
};

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        { _id: this._id }, 
        process.env.JWT_REFRESH_SECRET, 
        { expiresIn: '7d' }
    );
};

// Static methods
userSchema.statics.findByEmailWithPassword = function(email) {
  return this.findOne({ email }).select('+password');
};

const User = mongoose.model('User', userSchema);

module.exports = User;
