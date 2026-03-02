# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A full-stack MERN (MongoDB, Express, React, Node.js) turf/ground booking system with role-based access control. Four user roles exist: `user`, `groundManager`, `paymentManager`, and `admin`.

## Development Commands

### Backend (server/)
```powershell
cd server
npm install                # Install dependencies
npm start                  # Start server (port 5000)
npm run seed               # Seed database with sample data (clears existing data)
```

### Frontend (client/)
```powershell
cd client
npm install                # Install dependencies
npm run dev                # Start Vite dev server (port 5173)
npm run build              # Production build
npm run lint               # Run ESLint
```

### Required Environment
Create `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/turf-booking
JWT_SECRET=your-secret-key
```

## Architecture

### Backend Structure (CommonJS)
- `server/server.js` - Express entry point, mounts all routes under `/api/*`
- `server/config/db.js` - MongoDB/Mongoose connection
- `server/middleware/auth.js` - JWT auth (`protect`) and role checking (`authorize`)
- `server/controllers/` - Business logic per domain (auth, ground, booking, payment, admin)
- `server/models/` - Mongoose schemas: User, Ground, Booking, Payment
- `server/routes/` - Express route definitions mapping to controllers

### Frontend Structure (ES Modules, React 19 + Vite)
- `client/src/main.jsx` - Entry point, wraps app in AuthProvider and BrowserRouter
- `client/src/App.jsx` - Route definitions with role-based route guards
- `client/src/context/AuthContext.jsx` - Auth state management (user, token, localStorage persistence)
- `client/src/config/api.js` - API endpoint constants, uses `VITE_API_URL` env var or defaults to localhost:5000
- `client/src/pages/` - Page components per role/feature

### Authentication Flow
1. JWT token returned on login/register
2. Token stored in localStorage via AuthContext
3. Frontend sends `Authorization: Bearer <token>` header
4. Backend `protect` middleware validates token and attaches `req.user`
5. `authorize(...roles)` middleware checks `req.user.role`

### Role Access Patterns
- **user**: Browse grounds, create bookings, make payments, view own history
- **groundManager**: CRUD own grounds, approve/reject bookings for their grounds
- **paymentManager**: View all payments, verify/refund payments
- **admin**: Full access - user management, system stats, all CRUD operations

## Key Implementation Details

- Booking availability is checked against existing approved/pending bookings for the same ground, date, and time slot
- Payments are simulated (no real gateway) - transactionID is generated client-side
- Ground managers can only manage grounds where `managerID` matches their user ID
- User model enforces 10-digit phone validation and minimum 8-character passwords

## API Route Prefixes
- `/api/auth` - Authentication (register, login, me)
- `/api/grounds` - Ground CRUD + `/manager/my-grounds`
- `/api/bookings` - Booking CRUD + `/availability` + `/ground/:groundId`
- `/api/payments` - Payment CRUD + `/verify` + `/refund`
- `/api/admin` - User management + `/stats`
