# 🚀 Deployment Guide for KrishiSetu

This project is structured as a full-stack application with a **React (Vite) frontend** and a **Node.js (Express) backend**.

## 1. Frontend Deployment (Vercel)

Vercel is the recommended platform for hosting the frontend.

### Step-by-Step Instructions:

1.  **Push your code to GitHub/GitLab/Bitbucket.**
2.  **Import the project to Vercel.**
3.  **Configure Project Settings:**
    *   **Root Directory:** Set this to `CraftCore/frontend`.
    *   **Framework Preset:** Vercel should auto-detect **Vite**.
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
4.  **Add Environment Variables:**
    *   Go to **Settings > Environment Variables**.
    *   Add `VITE_API_URL`: Use your production backend URL (e.g., `https://your-backend.herokuapp.com/api`).
    *   *Note: If you haven't deployed the backend yet, you can leave it blank initially, and it will fallback to localhost (which won't work in production).*

### Why `vercel.json` is included?
We've added a `frontend/vercel.json` to handle **SPA Routing**. This ensures that if you refresh the page on a route like `/dashboard`, Vercel will correctly serve `index.html` instead of a 404 error.

---

## 2. Backend Deployment (Render / Railway / VPS)

The backend uses **Socket.io**, **BullMQ**, and **Redis**. These require a **persistent server (Stateful)** and do not work well on Serverless platforms like Vercel.

### Recommended Platforms:
*   **[Render.com](https://render.com/)** (Best for free-tier Node/Express)
*   **[Railway.app](https://railway.app/)**
*   **VPS (DigitalOcean / AWS EC2)**

### Steps for Render:
1.  **Root Directory:** `CraftCore/backend`
2.  **Build Command:** `npm install`
3.  **Start Command:** `npm start`
4.  **Environment Variables:** Add all variables from your `backend/.env` file.
5.  **Redis:** You will need a Redis instance (Render offers internal Redis, or you can use [Upstash](https://upstash.com/)).

---

## 3. Important Notes

*   **CORS:** Ensure that your backend's `CORS_ORIGIN` environment variable is set to your Vercel frontend URL (e.g., `https://krishisetu.vercel.app`).
*   **SSL:** Both frontend and backend must use `https` for Secure Cookies and Socket connections.

---

**Ready for deployment!** Your frontend code has been updated to support environment-based API URLs.
