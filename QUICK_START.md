# Quick Start Guide

Get your Turf Booking System up and running in minutes!

## Prerequisites Check

- [ ] Node.js installed (v14 or higher) - Check with: `node --version`
- [ ] MongoDB installed and running OR MongoDB Atlas account
- [ ] npm installed - Check with: `npm --version`

## Step-by-Step Setup

### 1. Backend Setup (5 minutes)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Windows PowerShell:
Copy-Item .env.example .env

# Or manually create .env file with:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/turf-booking
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Start the server
npm start
```

**Expected Output:**
```
MongoDB connected: localhost:27017
Server running on port 5000
```

### 2. Frontend Setup (3 minutes)

**Open a NEW terminal window** (keep backend running)

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Expected Output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3. Access the Application

- **Frontend**: Open http://localhost:5173 in your browser
- **Backend API**: http://localhost:5000

## First Steps After Setup

### 1. Register Test Users

Go to http://localhost:5173/register and create accounts with these roles:

- **Regular User**: Role = "User"
- **Ground Manager**: Role = "Ground Manager"  
- **Payment Manager**: Role = "Payment Manager"
- **Admin**: Role = "Admin"

### 2. Create Your First Ground

1. Login as **Ground Manager**
2. Go to **Ground Manager** dashboard
3. Fill in the form:
   - Ground Name: "City Sports Complex"
   - Location: "Main Street"
   - Price Per Slot: 500
   - Available Slots: `09:00-10:00, 10:00-11:00, 11:00-12:00`
4. Click **Create Ground**

### 3. Make Your First Booking

1. Login as **User**
2. Go to **Grounds** page
3. Click **Book Now** on a ground
4. Select date and time slot
5. Click **Book Now**

### 4. Approve the Booking

1. Login as **Ground Manager**
2. Go to **Ground Manager** dashboard
3. Find your booking under the ground
4. Click **Approve**

### 5. Process Payment

1. Login as **User**
2. Go to **My Bookings**
3. Click **Pay Now** for unpaid booking
4. Complete payment (simulated)

### 6. Verify Payment

1. Login as **Payment Manager**
2. Go to **Payment Manager** dashboard
3. Find the payment
4. Click **Verify**

### 7. View Admin Dashboard

1. Login as **Admin**
2. Go to **Admin** dashboard
3. View system statistics
4. Manage users

## Troubleshooting

### Backend Issues

**Problem**: `MongoDB connection error`
- **Solution**: Make sure MongoDB is running
  - Windows: Check MongoDB service in Services
  - Or use MongoDB Atlas and update MONGO_URI in .env

**Problem**: `Port 5000 already in use`
- **Solution**: Change PORT in .env file to another port (e.g., 5001)

**Problem**: `Cannot find module`
- **Solution**: Run `npm install` again in server directory

### Frontend Issues

**Problem**: `Cannot connect to backend`
- **Solution**: 
  - Make sure backend is running on port 5000
  - Check browser console for errors
  - Verify CORS is enabled in server.js

**Problem**: `Port 5173 already in use`
- **Solution**: Vite will automatically use the next available port

**Problem**: `Module not found`
- **Solution**: Run `npm install` again in client directory

## MongoDB Setup Options

### Option 1: Local MongoDB

1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Use: `MONGO_URI=mongodb://localhost:27017/turf-booking`

### Option 2: MongoDB Atlas (Cloud - Recommended for Demo)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Use: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/turf-booking`
5. Add your IP to whitelist in Atlas dashboard

## Testing Checklist

After setup, verify these work:

- [ ] Backend server starts without errors
- [ ] Frontend loads in browser
- [ ] Can register a new user
- [ ] Can login
- [ ] Can view grounds page
- [ ] Can create a ground (as Ground Manager)
- [ ] Can make a booking (as User)
- [ ] Can approve booking (as Ground Manager)
- [ ] Can make payment (as User)
- [ ] Can verify payment (as Payment Manager)
- [ ] Can access admin dashboard (as Admin)

## Next Steps

- Read `README.md` for detailed documentation
- Follow `SETUP_CHECKLIST.md` for comprehensive testing
- Review `PROJECT_SUMMARY.md` for project overview

## Need Help?

Check the main `README.md` file for:
- Detailed API documentation
- Complete feature list
- Troubleshooting guide
- Project structure

---

**You're all set! Happy coding! 🚀**
