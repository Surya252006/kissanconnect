# KisanConnect — Production Deployment Guide

This guide provides step-by-step instructions for deploying KisanConnect to production across **Vercel** (Frontend), **Render / Railway / AWS** (Backend), **MongoDB Atlas** (Database), and **Cloudinary** (Media CDN).

---

## 1. Architecture Map

```
┌───────────────────────────────────────┐
│     Frontend (React 18 + Vite)        │
│          Hosted on Vercel             │
│   Environment: VITE_API_URL           │
└──────────────────┬────────────────────┘
                   │ HTTPS / REST API
┌──────────────────▼────────────────────┐
│      Backend (Express.js / Node.js)   │
│   Hosted on Render / Railway / AWS    │
│   Environment: MONGO_URI, JWT_SECRET, │
│                CLIENT_URL, CLOUDINARY │
└───────────┬───────────────────────┬───┘
            │                       │
┌───────────▼──────────┐ ┌──────────▼──────────┐
│    MongoDB Atlas     │ │     Cloudinary      │
│  (Managed Cluster)   │ │  (Media CDN Storage)│
└──────────────────────┘ └─────────────────────┘
```

---

## 2. Frontend Deployment (Vercel)

1. **Import Repository to Vercel:**
   - Go to [vercel.com](https://vercel.com) and click **Add New Project**.
   - Select the `kissanconnect` repository.

2. **Configure Build Settings:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Environment Variables:**
   - `VITE_API_URL`: `https://your-backend-api.onrender.com/api`

4. **SPA Routing:**
   - The included `client/vercel.json` automatically handles client-side routing rewrites:
     ```json
     {
       "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
     }
     ```

5. **Deploy:** Click **Deploy**.

---

## 3. Backend Deployment (Render / Railway)

### Option A: Render (Web Service)
1. Go to [render.com](https://render.com) and create a **New Web Service**.
2. Connect your Git repository.
3. Set the following options:
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add **Environment Variables**:
   ```env
   PORT=10000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/kissanconnect?retryWrites=true&w=majority
   JWT_SECRET=your_secure_production_jwt_secret_key_32chars
   CLIENT_URL=https://your-kissanconnect-frontend.vercel.app
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
5. Click **Create Web Service**.

---

## 4. Database Setup (MongoDB Atlas)

1. Create a free M0/M10 cluster on [cloud.mongodb.com](https://cloud.mongodb.com).
2. Under **Network Access**, add IP `0.0.0.0/0` (Allow access from anywhere) so cloud web services can connect.
3. Under **Database Access**, create a user with read/write privileges.
4. Copy the connection string and populate `MONGO_URI`.

---

## 5. Media Storage Setup (Cloudinary)

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Copy your **Cloud Name**, **API Key**, and **API Secret** from the dashboard.
3. Add these variables to your backend environment on Render/Railway.

---

## 6. Production Smoke Test Verification

After deploying both frontend and backend:
1. Open `https://your-backend-api.onrender.com/api/health` -> Verify `{ "success": true, "database": "connected" }`.
2. Open `https://your-frontend.vercel.app/` -> Verify Landing Page and Marketplace load.
3. Log in with demo accounts or register a new user -> Verify JWT creation and dashboard redirection.
4. Place a test produce order -> Verify atomic stock deduction and order timeline synchronization.
