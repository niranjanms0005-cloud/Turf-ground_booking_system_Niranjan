# Deployment Guide — Turf Booking System

This guide walks you through hosting the project for **free** using:

- **Vercel** — Frontend (React + Vite)
- **Render** — Backend (Node.js + Express)
- **MongoDB Atlas** — Cloud database

You will use your existing **GitHub repository**. CORS is configured so that you only need to set the frontend URL in Render’s environment; no code change is required when the URL changes.

---

## Prerequisites

- GitHub repo with your project (client and server in the same repo: `client/` and `server/` folders)
- Accounts (free): [Vercel](https://vercel.com), [Render](https://render.com), [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 1. MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and sign in or create an account.
2. **Create a cluster** (e.g. free M0).
3. **Database Access** → Add Database User → create a user and password (save them).
4. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) so Render can connect.
5. **Database** → Connect → **Connect your application** → copy the connection string. It looks like:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your DB user. Optionally add a database name:
   ```text
   mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/yourdbname?retryWrites=true&w=majority
   ```
   Save this as your **MONGO_URI** (you’ll use it in Render).

---

## 2. Render (Backend)

1. Go to [Render](https://render.com) and sign in with GitHub.
2. **New +** → **Web Service**.
3. Connect your GitHub account/repo and select the repository that contains your project.
4. Configure the service:
   - **Name:** e.g. `turf-booking-api`
   - **Region:** choose the closest to your users
   - **Root Directory:** `server`  
     (so Render runs from the folder that has `server.js` and `package.json`)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Environment** — Add these variables (Replace the placeholders with your real values):

   | Key           | Value |
   |---------------|--------|
   | `MONGO_URI`   | Your MongoDB Atlas connection string (from step 1) |
   | `JWT_SECRET`  | A long random string (e.g. generate one at [randomkeygen.com](https://randomkeygen.com)) |
   | `FRONTEND_URL`| Your Vercel app URL, e.g. `https://your-app.vercel.app` (no trailing slash). **Add this after you deploy the frontend.** For now you can set a placeholder and update it later. |

   CORS is set in the backend to use `FRONTEND_URL`. When you change the frontend URL (e.g. new Vercel URL), just update **FRONTEND_URL** in Render’s Environment; no code or GitHub push is needed.

6. Click **Create Web Service**. Wait for the first deploy to finish.
7. Copy your backend URL, e.g. `https://turf-booking-api.onrender.com` (you’ll use it in Vercel as the API URL).

---

## 3. Vercel (Frontend)

1. Go to [Vercel](https://vercel.com) and sign in with GitHub.
2. **Add New** → **Project** → import the same GitHub repository.
3. Configure the project:
   - **Root Directory:** `client`  
     (so Vercel builds the React app in the folder that has `vite.config.js` and `package.json`)
   - **Framework Preset:** Vite (should be auto-detected)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default for Vite)
4. **Environment Variables** — Add:

   | Key             | Value |
   |-----------------|--------|
   | `VITE_API_URL`  | Your Render backend URL, e.g. `https://turf-booking-api.onrender.com` (no trailing slash) |

   The frontend uses `VITE_API_URL` (see `client/src/config/api.js`). All API requests will go to this URL in production.

5. Click **Deploy**. Wait for the build to finish.
6. Copy your frontend URL, e.g. `https://your-project.vercel.app`.

---

## 4. Point Backend to Frontend (CORS)

1. In **Render** → your Web Service → **Environment**.
2. Set **FRONTEND_URL** to your Vercel URL, e.g. `https://your-project.vercel.app` (no trailing slash).
3. Save. Render will redeploy with the new value.  
   The backend already uses:

   ```js
   app.use(
     cors({
       origin: process.env.FRONTEND_URL || "http://localhost:5173",
       credentials: true,
     })
   );
   ```

   So only the env variable needs to change when the frontend URL changes.

---

## 5. Verify

1. Open your Vercel URL (e.g. `https://your-project.vercel.app`).
2. Register / log in and use the app (grounds, booking, payments, etc.).
3. If you see CORS or “blocked by CORS” errors:
   - Confirm **FRONTEND_URL** in Render exactly matches the Vercel URL (no trailing slash).
   - Confirm **VITE_API_URL** in Vercel exactly matches the Render backend URL.

---

## 6. Optional: .env for local development

**Server (`server/.env`):**

```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/yourdbname?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

**Client:**  
For local dev, the app uses `http://localhost:5000` when `VITE_API_URL` is not set. To point the client at a deployed API, create `client/.env`:

```env
VITE_API_URL=https://turf-booking-api.onrender.com
```

Do **not** commit `.env` files with real secrets. Add them to `.gitignore` (usually already there).

---

## 7. Summary

| Where   | What to set |
|--------|-------------|
| **MongoDB Atlas** | Connection string; allow `0.0.0.0/0` for Render. |
| **Render**        | Root: `server`. Env: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL` (your Vercel URL). |
| **Vercel**        | Root: `client`. Env: `VITE_API_URL` (your Render backend URL). |

After deployment, you only need to update **FRONTEND_URL** in Render if the frontend URL changes (e.g. new Vercel project or custom domain). No code changes or GitHub pushes required for that.
