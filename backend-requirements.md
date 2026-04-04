# Backend Requirements Report

## Project: AgriSense - AI-Powered Agricultural Intelligence Platform

**Stack**: Node.js + Express + MongoDB (Mongoose)  
**Auth**: JWT + Google OAuth (Passport.js)  
**Deployment**: Render (backend) + Vercel (frontend)  
**Generated**: April 2026

---

## 1. API Endpoints

### 1.1 Authentication Routes
| Method | Route | Auth | Request Body | Response |
|--------|-------|------|--------------|----------|
| POST | /api/auth/register | Public | `{ name, email, password, farmName, totalAcres, location }` | `{ user, token }` |
| POST | /api/auth/login | Public | `{ email, password }` | `{ user, token }` |
| POST | /api/auth/logout | JWT | - | `{ success: true }` |
| GET | /api/auth/me | JWT | - | `{ user }` |
| GET | /api/auth/google | Public | - | Google OAuth redirect |
| GET | /api/auth/google/callback | Public | - | `{ user, token }` |
| POST | /api/auth/refresh | JWT | `{ refreshToken }` | `{ token }` |
| PUT | /api/auth/profile | JWT | `{ name, farmName, totalAcres, location }` | `{ user }` |

### 1.2 Soil Reports Routes
| Method | Route | Auth | Request Body | Response |
|--------|-------|------|--------------|----------|
| GET | /api/soil-reports | JWT | - | `{ reports: SoilReport[] }` |
| POST | /api/soil-reports | JWT | `multipart/form-data` (PDF/image) | `{ report }` |
| GET | /api/soil-reports/:id | JWT | - | `{ report }` |
| DELETE | /api/soil-reports/:id | JWT | - | `{ success: true }` |
| GET | /api/soil-reports/:id/analysis | JWT | - | `{ analysis: AIAnalysis }` |
| GET | /api/soil-reports/latest | JWT | - | `{ report }` |

### 1.3 Advisory Routes
| Method | Route | Auth | Request Body | Response |
|--------|-------|------|--------------|----------|
| GET | /api/advisories | JWT | `?category=&severity=` | `{ advisories: Advisory[] }` |
| GET | /api/advisories/:id | JWT | - | `{ advisory }` |
| PATCH | /api/advisories/:id/read | JWT | - | `{ advisory }` |
| PATCH | /api/advisories/:id | JWT | `{ isRead }` | `{ advisory }` |
| POST | /api/advisories/subscribe | JWT | `{ categories: string[] }` | `{ success: true }` |

### 1.4 Crops Routes
| Method | Route | Auth | Request Body | Response |
|--------|-------|------|--------------|----------|
| GET | /api/crops | JWT | - | `{ crops: Crop[] }` |
| POST | /api/crops | JWT | `{ name, area, health, stage, plantedDate, expectedHarvest }` | `{ crop }` |
| PUT | /api/crops/:id | JWT | `{ name, area, health, stage, expectedHarvest }` | `{ crop }` |
| DELETE | /api/crops/:id | JWT | - | `{ success: true }` |
| GET | /api/crops/:id/health-history | JWT | - | `{ history: HealthRecord[] }` |
| POST | /api/crops/:id/health | JWT | `{ health, notes }` | `{ record }` |

### 1.5 Weather Routes
| Method | Route | Auth | Request Body | Response |
|--------|-------|------|--------------|----------|
| GET | /api/weather/current | JWT | `?lat=&lng=` | `{ weather: CurrentWeather }` |
| GET | /api/weather/forecast | JWT | `?days=7&lat=&lng=` | `{ forecast: DailyForecast[] }` |
| GET | /api/weather/agricultural | JWT | `?lat=&lng=` | `{ advisory: AgriWeatherAdvisory }` |
| GET | /api/weather/locations | JWT | - | `{ locations: SavedLocation[] }` |
| POST | /api/weather/locations | JWT | `{ name, lat, lng }` | `{ location }` |

### 1.6 AI Advisor (Chat) Routes
| Method | Route | Auth | Request Body | Response |
|--------|-------|------|--------------|----------|
| GET | /api/chat/sessions | JWT | - | `{ sessions: ChatSession[] }` |
| POST | /api/chat/sessions | JWT | - | `{ session }` |
| GET | /api/chat/sessions/:id/messages | JWT | - | `{ messages: Message[] }` |
| POST | /api/chat/sessions/:id/messages | JWT | `{ content, domain }` | `{ message, aiResponse }` |
| DELETE | /api/chat/sessions/:id | JWT | - | `{ success: true }` |
| POST | /api/chat/quick-advice | JWT | `{ query, domain, context? }` | `{ advice: string, sources? }` |

### 1.7 Dashboard / Analytics Routes
| Method | Route | Auth | Request Body | Response |
|--------|-------|------|--------------|----------|
| GET | /api/dashboard/stats | JWT | - | `{ cropHealth, activeArea, yieldEst, alerts }` |
| GET | /api/dashboard/yield-projection | JWT | `?months=6` | `{ data: YieldDataPoint[] }` |
| GET | /api/dashboard/rainfall | JWT | `?months=6` | `{ data: RainfallDataPoint[] }` |
| GET | /api/dashboard/activity-feed | JWT | - | `{ activities: Activity[] }` |
| GET | /api/dashboard/nutrients | JWT | - | `{ nutrients: NutrientData }` |

### 1.8 Activity / Audit Routes
| Method | Route | Auth | Request Body | Response |
|--------|-------|------|--------------|----------|
| GET | /api/activities | JWT | `?limit=50&offset=0` | `{ activities: Activity[] }` |
| POST | /api/activities | JWT | `{ action, details? }` | `{ activity }` |
| GET | /api/activities/audit-trail | JWT (Admin) | `?startDate=&endDate=` | `{ audit: AuditRecord[] }` |

### 1.9 Domain Routes
| Method | Route | Auth | Request Body | Response |
|--------|-------|------|--------------|----------|
| GET | /api/domains | JWT | - | `{ domains: Domain[] }` |
| GET | /api/domains/current | JWT | - | `{ domain }` |
| PUT | /api/domains/current | JWT | `{ domain: 'AgriTech' \| 'FinTech' \| 'Health' \| 'EdTech' \| 'Civic' }` | `{ user }` |

---

## 2. Authentication & Authorization

### 2.1 Auth Strategy
- **Primary**: JWT (JSON Web Tokens) with access + refresh token pattern
- **Secondary**: Google OAuth 2.0 via Passport.js
- **Token Storage**: httpOnly cookies for refresh tokens, Authorization header (Bearer) for access tokens

### 2.2 Protected Routes
All routes except `/api/auth/*` require JWT authentication.

### 2.3 Role-Based Access
| Role | Permissions |
|------|-------------|
| `farmer` (default) | Access own farm data, soil reports, crops, advisories |
| `admin` | Access all user data, system audit, manage advisories |

### 2.4 Token Configuration
- **Access Token**: 15 minutes expiry, stored in Authorization header
- **Refresh Token**: 7 days expiry, stored in httpOnly cookie
- **Algorithm**: RS256 (asymmetric) or HS256 (symmetric)

### 2.5 Google OAuth Flow
1. Frontend redirects to `/api/auth/google`
2. Backend redirects to Google consent screen
3. Callback at `/api/auth/google/callback`
4. Create/update user, issue JWT tokens
5. Redirect to frontend with tokens

---

## 3. Database Models (Mongoose)

### 3.1 User Model
```javascript
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return !this.googleId; } },
  name: { type: String, required: true },
  googleId: { type: String, sparse: true },
  avatar: { type: String },
  
  // Farm Profile
  farmName: { type: String, default: '' },
  totalAcres: { type: Number, default: 0 },
  location: {
    address: String,
    lat: Number,
    lng: Number,
    state: String,
    district: String
  },
  
  // Preferences
  currentDomain: { 
    type: String, 
    enum: ['AgriTech', 'FinTech', 'Health', 'EdTech', 'Civic'],
    default: 'AgriTech'
  },
  notificationPrefs: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    categories: [{ type: String, enum: ['pest', 'weather', 'crop', 'soil', 'market'] }]
  },
  
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  refreshTokens: [{ token: String, createdAt: Date }]
}, { timestamps: true });
```

### 3.2 SoilReport Model
```javascript
const soilReportSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true }, // Cloudinary/S3 URL
  fileType: { type: String, enum: ['pdf', 'png', 'jpg'], required: true },
  uploadDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['processing', 'complete', 'error'], 
    default: 'processing' 
  },
  
  // AI Analysis Results
  results: {
    ph: { type: Number, min: 0, max: 14 },
    nitrogen: { type: Number }, // kg/ha
    phosphorus: { type: Number }, // kg/ha
    potassium: { type: Number }, // kg/ha
    organicMatter: { type: Number }, // %
    moisture: { type: Number }, // %
    texture: { 
      type: String, 
      enum: ['Sandy', 'Loamy', 'Clay', 'Sandy Loam', 'Silt Loam', 'Silty Clay'] 
    },
    healthScore: { type: Number, min: 0, max: 100 },
    recommendations: [{ type: String }],
    micronutrients: {
      zinc: Number,
      iron: Number,
      manganese: Number,
      copper: Number
    }
  },
  
  // Processing metadata
  processingStartedAt: Date,
  processingCompletedAt: Date,
  errorMessage: String
}, { timestamps: true });
```

### 3.3 Advisory Model
```javascript
const advisorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  title: { type: String, required: true },
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
  date: { type: Date, default: Date.now },
  summary: { type: String, required: true },
  details: { type: String, required: true },
  actionItems: [{ type: String }],
  isRead: { type: Boolean, default: false },
  readAt: Date,
  
  // AI-generated or admin-created
  source: { type: String, enum: ['ai', 'admin', 'system'], default: 'ai' },
  relatedReportId: { type: Schema.Types.ObjectId, ref: 'SoilReport' },
  
  // For system-wide advisories (null = all users)
  isGlobal: { type: Boolean, default: false },
  targetLocation: {
    state: String,
    district: String
  }
}, { timestamps: true });
```

### 3.4 Crop Model
```javascript
const cropSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  area: { type: Number, required: true }, // acres
  health: { type: Number, min: 0, max: 100, default: 100 },
  stage: { type: String, required: true },
  plantedDate: { type: Date, required: true },
  expectedHarvest: { type: Date, required: true },
  
  // Health history for trend analysis
  healthHistory: [{
    date: { type: Date, default: Date.now },
    health: Number,
    notes: String
  }],
  
  // Additional metadata
  variety: String,
  fieldLocation: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
```

### 3.5 ChatSession Model
```javascript
const chatSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  domain: { 
    type: String, 
    enum: ['AgriTech', 'FinTech', 'Health', 'EdTech', 'Civic'],
    default: 'AgriTech'
  },
  title: { type: String, default: 'New Chat' },
  messages: [{
    role: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    sources: [{ type: String }] // AI citations
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
```

### 3.6 Activity Model
```javascript
const activitySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true },
  details: { type: Schema.Types.Mixed },
  ipAddress: String,
  userAgent: String,
  location: {
    address: String,
    lat: Number,
    lng: Number
  }
}, { timestamps: true });
```

### 3.7 WeatherCache Model
```javascript
const weatherCacheSchema = new Schema({
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  current: { type: Schema.Types.Mixed },
  forecast: { type: Schema.Types.Mixed },
  agriculturalAdvisory: String,
  cachedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });
weatherCacheSchema.index({ 'location.lat': 1, 'location.lng': 1 });
```

---

## 4. Real-Time / WebSocket Needs

### 4.1 Socket.io Events Required

**Connection Events:**
- `connection` - User connects with JWT token
- `disconnect` - User disconnects
- `join:farm` - Subscribe to farm-specific updates

**Emit Events (Server → Client):**
| Event | Payload | Trigger |
|-------|---------|---------|
| `soil:analysis:complete` | `{ reportId, results }` | AI analysis finishes |
| `soil:analysis:progress` | `{ reportId, progress: 0-100 }` | Processing update |
| `advisory:new` | `{ advisory }` | New advisory generated |
| `crop:health:alert` | `{ cropId, health, message }` | Health drops below threshold |
| `weather:alert` | `{ type, severity, message }` | Weather advisory issued |
| `activity:new` | `{ activity }` | New activity in feed |
| `chat:ai:streaming` | `{ sessionId, chunk }` | AI response streaming |

**Receive Events (Client → Server):**
| Event | Payload | Purpose |
|-------|---------|---------|
| `chat:send` | `{ sessionId, content, domain }` | Send chat message |
| `chat:typing` | `{ sessionId }` | Typing indicator |
| `advisory:mark-read` | `{ advisoryId }` | Mark advisory read |

### 4.2 Real-Time Implementation Notes
- Use Socket.io with Redis adapter for multi-server scaling
- Authenticate socket connections with JWT on handshake
- Room-based subscriptions: `farm:${userId}`, `location:${state}`
- Implement rate limiting for chat messages (10 req/min)

---

## 5. Third-Party Services

### 5.1 Required External APIs

| Service | Purpose | Backend Proxy? | Why |
|---------|---------|----------------|-----|
| **OpenAI/Claude/Gemini** | AI soil analysis, chat responses, advisory generation | **YES** | Protect API keys, enable request caching, rate limiting |
| **OpenWeatherMap/WeatherAPI** | Weather forecasts, agricultural alerts | **YES** | Caching, rate limiting, data transformation |
| **Google Maps Geocoding** | Location → Lat/Lng conversion | **YES** | API key protection |

### 5.2 Recommended Service Integrations

| Service | Purpose | Notes |
|---------|---------|-------|
| **Cloudinary** | Image/PDF storage and optimization | Direct upload from frontend with signed URLs |
| **SendGrid/Resend** | Email notifications | For advisory alerts, weekly digests |
| **Firebase Cloud Messaging** | Push notifications | Mobile push support |

### 5.3 AI/ML Service Architecture
```
Frontend → Backend → AI Service (OpenAI)
              ↓
         Cache Layer (Redis)
              ↓
         Response Processing
              ↓
         Store Results (MongoDB)
              ↓
         Socket.io Push
```

---

## 6. File Upload Configuration

### 6.1 Upload Flow
1. **Frontend** selects file (PDF, PNG, JPG) - max 10MB
2. **Backend** validates file type and size
3. **Backend** generates signed Cloudinary upload URL OR uploads directly via Multer
4. **Cloudinary** stores file, returns URL
5. **Backend** creates SoilReport with `processing` status
6. **Queue** triggers AI analysis job
7. **Socket.io** notifies client when complete

### 6.2 Multer Configuration
```javascript
const multerConfig = {
  storage: multer.memoryStorage(), // or CloudinaryStorage
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'), false);
  }
};
```

### 6.3 Cloudinary Configuration
```javascript
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

### 6.4 File Processing Queue
- Use Bull/Agenda with Redis for background processing
- Queue name: `soil-analysis`
- Job data: `{ reportId, fileUrl, userId }`
- AI processing timeout: 30 seconds
- Retry policy: 3 attempts with exponential backoff

---

## 7. Background Jobs / Email

### 7.1 Required Background Jobs

| Job | Schedule | Queue | Description |
|-----|----------|-------|-------------|
| `analyze-soil-report` | On-demand | `analysis` | AI analysis of uploaded soil reports |
| `generate-daily-advisories` | Daily 6:00 AM | `advisories` | Generate weather-based advisories |
| `send-weekly-digest` | Weekly (Sundays) | `email` | Weekly farm summary email |
| `check-crop-health-alerts` | Every 4 hours | `monitoring` | Alert on health drops |
| `cleanup-old-activities` | Daily 2:00 AM | `maintenance` | Delete activities > 90 days |
| `refresh-weather-cache` | Every 3 hours | `weather` | Update weather data |
| `process-chat-ai-response` | On-demand | `ai-chat` | Stream AI responses via Socket.io |

### 7.2 Email Triggers

| Trigger | Recipients | Content |
|---------|------------|---------|
| `advisory:critical` | User | Immediate email for critical advisories |
| `soil:analysis:complete` | User | Analysis results with recommendations |
| `weekly-digest` | User | Weekly crop health, pending actions, weather outlook |
| `account:created` | User | Welcome email with onboarding guide |

### 7.3 Queue Configuration (Bull with Redis)
```javascript
const analysisQueue = new Bull('analysis', process.env.REDIS_URL);
analysisQueue.process('analyze-soil', 5, async (job) => {
  // AI analysis logic
});
```

---

## 8. Validation Rules

### 8.1 User Registration
```javascript
const registerValidation = {
  name: { required: true, min: 2, max: 50 },
  email: { required: true, email: true },
  password: { required: true, min: 8, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/ },
  farmName: { max: 100 },
  totalAcres: { type: 'number', min: 0, max: 10000 }
};
```

### 8.2 Soil Report Upload
```javascript
const uploadValidation = {
  file: { 
    required: true, 
    maxSize: 10 * 1024 * 1024, // 10MB
    types: ['application/pdf', 'image/png', 'image/jpeg']
  }
};
```

### 8.3 Crop Creation
```javascript
const cropValidation = {
  name: { required: true, min: 2, max: 50 },
  area: { required: true, type: 'number', min: 0.1, max: totalAcres },
  health: { type: 'number', min: 0, max: 100 },
  stage: { required: true, max: 50 },
  plantedDate: { required: true, date: true, past: true },
  expectedHarvest: { required: true, date: true, future: true }
};
```

### 8.4 Chat Message
```javascript
const chatValidation = {
  content: { required: true, min: 1, max: 2000 },
  domain: { required: true, enum: ['AgriTech', 'FinTech', 'Health', 'EdTech', 'Civic'] }
};
```

### 8.5 Advisory Filter
```javascript
const advisoryFilterValidation = {
  category: { enum: ['pest', 'weather', 'crop', 'soil', 'market', 'all'] },
  severity: { enum: ['low', 'medium', 'high', 'critical', 'all'] },
  isRead: { type: 'boolean' },
  dateFrom: { date: true },
  dateTo: { date: true }
};
```

---

## 9. Ambiguous UI States Requiring Clarification

### 9.1 Open Questions for Product Team

1. **AI Analysis Processing**: 
   - How long should soil report analysis take? (Currently simulated at 3s)
   - Should users be charged per analysis or included in subscription?
   - What happens if AI analysis fails? (retry, manual fallback?)

2. **Multi-Domain Support**:
   - Domain switcher shows AgriTech/FinTech/Health/EdTech/Civic - are these separate products or just UI themes?
   - Does switching domains change available features or just styling?
   - Should domain-specific data be stored separately?

3. **Advisory System**:
   - Are advisories generated per-user based on their data or pulled from a global pool?
   - Who creates market advisories? (AI, admin, external API?)
   - Should critical advisories trigger SMS/push notifications?

4. **Activity Feed**:
   - Is the activity feed real-time (Socket.io) or just on page load?
   - Should it show only user's activities or community-wide anonymous data?
   - Is this for social features or just audit logging?

5. **Weather Data**:
   - Which weather API should be used? (OpenWeatherMap, WeatherAPI, IMD India?)
   - Should weather be location-based on farm profile or user-selectable?
   - Do we need historical weather data for yield projections?

6. **Crop Health Tracking**:
   - Is health manually entered or from IoT sensors?
   - What triggers health history updates?
   - Should there be photo documentation for health changes?

7. **AI Chat Context**:
   - Should AI advisor have access to user's soil reports/crops for context?
   - Is chat history persisted indefinitely?
   - Are there rate limits on AI queries?

8. **Data Export**:
   - Can users export their soil reports, crop data?
   - What format? (PDF, CSV, Excel?)

---

## 10. Environment Variables Required

```env
# Server
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# AI Services
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini

# Weather API
WEATHER_API_KEY=...

# Redis (for queues & socket scaling)
REDIS_URL=redis://localhost:6379

# Email
SENDGRID_API_KEY=...
EMAIL_FROM=noreply@agrisense.com

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

---

## 11. Summary

### Core Features Required
1. ✅ User authentication (JWT + Google OAuth)
2. ✅ Soil report upload & AI analysis
3. ✅ Advisory system with filtering
4. ✅ Crop management with health tracking
5. ✅ Weather integration with forecasts
6. ✅ AI chat advisor
7. ✅ Real-time notifications (Socket.io)
8. ✅ Activity logging
9. ✅ Multi-domain support (if needed beyond UI)

### Estimated Backend Scope
- **Models**: 7 core Mongoose schemas
- **API Routes**: ~40 endpoints
- **Background Jobs**: 7 recurring/on-demand workers
- **External Integrations**: 4-5 third-party APIs
- **Real-Time Features**: Socket.io with 8+ event types

### Recommended Implementation Order
1. Database models & relationships
2. Authentication system
3. Basic CRUD APIs (user, crops, soil reports)
4. File upload + Cloudinary
5. AI integration for soil analysis
6. Socket.io for real-time features
7. Background job queues
8. Email notifications
9. Weather API integration
10. Analytics & dashboard data

---

*Document generated from comprehensive frontend codebase analysis*
