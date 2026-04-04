# AgriSense Backend - AI-Powered Agricultural Platform

This is a production-ready Node.js backend for AgriSense, featuring OpenAI integration, real-time updates via Socket.io, and background task management with BullMQ.

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file based on `.env.example`.
   ```bash
   cp .env.example .env
   ```

3. **Required API Keys**:
   - `OPENAI_API_KEY`: For gpt-4o-mini analysis.
   - `REDIS_URL`: For BullMQ queues and Socket.io adapter.
   - `CLOUDINARY_*`: For soil report file storage.
   - `WEATHER_API_KEY`: From OpenWeatherMap.

4. **Run Server**:
   ```bash
   # Development (with nodemon)
   npm run dev

   # Production
   npm start
   ```

---

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Queues**: BullMQ + Redis
- **Real-Time**: Socket.io (Redis Adapter)
- **AI**: OpenAI (GPT-4o-mini)
- **Storage**: Cloudinary
- **Auth**: JWT (Access + Refresh Cookies) + Google OAuth

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register`: Register farmer profile.
- `POST /api/auth/login`: Login and receive access token + refresh cookie.
- `GET /api/auth/google`: Google OAuth entry point.

### Soil & Field Analysis
- `POST /api/soil-reports`: Upload report (PDF/Image) to queue analysis.
- `GET /api/soil-reports/latest`: Get latest completed AI analysis.

### Advisory & Crops
- `GET /api/advisories`: View weather, pest, and soil alerts.
- `GET /api/crops`: List and manage farm crop health.

### Chat & AI
- `POST /api/chat/sessions/:id/messages`: Context-aware AI agronomist chat.
- `GET /api/weather/agricultural`: AI weather-impact advisory.

---

## 🎯 Hackathon Highlights
- **DEMO_MODE**: Set `DEMO_MODE=true` in `.env` to bypass AI/Redis dependencies and use rule-based fallbacks for smooth presentations.
- **Activity Tracker**: Real-time auditing of user actions and system events.
- **Auto-Cleanup**: MongoDB TTL indexes automatically prune activity logs after 90 days.
- **Graceful Shutdown**: Server handles abrupt stops to prevent database corruption.
