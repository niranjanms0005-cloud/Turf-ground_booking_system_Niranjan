# Setup Checklist

Use this checklist to ensure everything is set up correctly before running the project.

## Backend Setup

- [ ] Node.js installed (v14+)
- [ ] Navigate to `server` directory
- [ ] Run `npm install` (dependencies installed)
- [ ] Create `.env` file in `server` directory with:
  - [ ] `PORT=5000`
  - [ ] `MONGO_URI=mongodb://localhost:27017/turf-booking` (or your MongoDB Atlas URI)
  - [ ] `JWT_SECRET=your-super-secret-jwt-key-change-this-in-production`
- [ ] MongoDB is running (if using local MongoDB)
- [ ] Run `npm start` - server should start on port 5000
- [ ] Check console for "MongoDB connected" message

## Frontend Setup

- [ ] Navigate to `client` directory
- [ ] Run `npm install` (dependencies installed)
- [ ] Run `npm run dev` - frontend should start (usually on port 5173)
- [ ] Open browser to `http://localhost:5173`

## Testing the Application

### 1. User Registration & Login
- [ ] Register a new user (role: user)
- [ ] Register a Ground Manager (role: groundManager)
- [ ] Register a Payment Manager (role: paymentManager)
- [ ] Register an Admin (role: admin)
- [ ] Login with each account to verify authentication

### 2. Ground Management
- [ ] Login as Ground Manager
- [ ] Go to Ground Manager Dashboard
- [ ] Create a new ground with:
  - Name, Location, Price per slot
  - Available slots (e.g., "09:00-10:00, 10:00-11:00, 11:00-12:00")
- [ ] Edit a ground
- [ ] Delete (deactivate) a ground

### 3. Booking Flow
- [ ] Login as regular User
- [ ] Browse grounds (public page)
- [ ] Click "Book Now" on a ground
- [ ] Select date and time slot
- [ ] Create booking (status should be "Pending")
- [ ] View "My Bookings" page

### 4. Booking Approval
- [ ] Login as Ground Manager
- [ ] Go to Ground Manager Dashboard
- [ ] View bookings for your grounds
- [ ] Approve a pending booking
- [ ] Reject a pending booking (optional)

### 5. Payment Flow
- [ ] Login as User
- [ ] Go to "My Bookings"
- [ ] Click "Pay Now" for an unpaid booking
- [ ] Complete payment (simulated)
- [ ] Verify payment status changed to "Paid"

### 6. Payment Management
- [ ] Login as Payment Manager
- [ ] Go to Payment Manager Dashboard
- [ ] View all payments
- [ ] Verify a payment
- [ ] Test refund functionality (optional)

### 7. Admin Dashboard
- [ ] Login as Admin
- [ ] Go to Admin Dashboard
- [ ] View System Statistics
- [ ] View User Management
- [ ] Change a user's role
- [ ] Delete a user (test account)

## Common Issues

### Server won't start
- Check if port 5000 is available
- Verify `.env` file exists and has correct values
- Check MongoDB connection string

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check browser console for CORS errors
- Ensure API URL in frontend matches backend URL

### Database connection errors
- Verify MongoDB is running (if local)
- Check MongoDB connection string in `.env`
- For MongoDB Atlas: check IP whitelist and credentials

### Authentication issues
- Verify JWT_SECRET is set in `.env`
- Check token is being stored in localStorage
- Clear browser localStorage and try again

## Demo Flow Recommendation

For your final year project presentation, follow this flow:

1. **Show Registration** - Register different user types
2. **Show Ground Management** - Create and manage grounds as Ground Manager
3. **Show Booking** - Make a booking as regular user
4. **Show Approval** - Approve booking as Ground Manager
5. **Show Payment** - Make payment as user
6. **Show Payment Verification** - Verify payment as Payment Manager
7. **Show Admin Dashboard** - Demonstrate admin controls and system stats

This demonstrates the complete workflow and all user roles!
