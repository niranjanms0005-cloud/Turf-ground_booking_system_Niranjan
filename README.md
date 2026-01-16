# Turf / Ground Booking System

A full-stack MERN (MongoDB, Express, React, Node.js) web application for managing sports turf and ground reservations.

## Features

- **User Management**: Registration, login, and role-based access control
- **Ground Management**: View, create, edit, and manage sports grounds
- **Booking System**: Real-time slot availability checking and booking management
- **Payment System**: Simulated payment processing with verification and refund capabilities
- **Role-Based Access**:
  - **User**: Browse grounds, make bookings, view booking history
  - **Ground Manager**: Manage grounds, approve/reject bookings
  - **Payment Manager**: Verify payments, handle refunds
  - **Admin**: System overview, user management, full system control

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs (Password hashing)

### Frontend
- React
- React Router DOM
- Vite

## Project Structure

```
project/
├── server/                 # Backend (Node.js + Express)
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth & error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/          # Utility functions
│   └── server.js        # Entry point
│
└── client/              # Frontend (React + Vite)
    ├── src/
    │   ├── context/    # React context (Auth)
    │   ├── pages/      # Page components
    │   ├── App.jsx    # Main app component
    │   └── main.jsx  # Entry point
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/turf-booking
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Note**: Replace `MONGO_URI` with your MongoDB connection string:
- Local MongoDB: `mongodb://localhost:27017/turf-booking`
- MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/turf-booking`

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Grounds
- `GET /api/grounds` - Get all active grounds (public)
- `GET /api/grounds/:id` - Get ground by ID (public)
- `POST /api/grounds` - Create ground (Ground Manager/Admin)
- `PUT /api/grounds/:id` - Update ground (Ground Manager/Admin)
- `DELETE /api/grounds/:id` - Delete ground (Ground Manager/Admin)
- `GET /api/grounds/manager/my-grounds` - Get manager's grounds (Ground Manager)

### Bookings
- `POST /api/bookings` - Create booking (User)
- `GET /api/bookings/user` - Get user's bookings (User)
- `GET /api/bookings/ground/:groundId` - Get bookings for a ground (Ground Manager)
- `GET /api/bookings` - Get all bookings (Admin)
- `PUT /api/bookings/:id/approve` - Approve booking (Ground Manager/Admin)
- `PUT /api/bookings/:id/reject` - Reject booking (Ground Manager/Admin)
- `GET /api/bookings/availability` - Check slot availability (public)

### Payments
- `POST /api/payments` - Create payment (User)
- `GET /api/payments/user` - Get user's payments (User)
- `GET /api/payments` - Get all payments (Payment Manager/Admin)
- `PUT /api/payments/:id/verify` - Verify payment (Payment Manager/Admin)
- `PUT /api/payments/:id/refund` - Refund payment (Payment Manager/Admin)

### Admin
- `GET /api/admin/users` - Get all users (Admin)
- `PUT /api/admin/users/:id/role` - Update user role (Admin)
- `DELETE /api/admin/users/:id` - Delete user (Admin)
- `GET /api/admin/stats` - Get system statistics (Admin)

## Demo Flow

1. **Register Users**: Create accounts with different roles (User, Ground Manager, Payment Manager, Admin)

2. **Create Grounds**: Login as Ground Manager and add grounds with available time slots

3. **Make Bookings**: Login as User, browse grounds, select date/time slot, and create booking

4. **Approve Bookings**: Login as Ground Manager, view bookings, and approve/reject them

5. **Process Payments**: Login as User, make payment for unpaid bookings (simulated)

6. **Verify Payments**: Login as Payment Manager, verify payments and handle refunds if needed

7. **Admin Control**: Login as Admin to view system stats and manage users

## Default Roles

- **user**: Regular customer/player
- **groundManager**: Manages grounds and bookings
- **paymentManager**: Handles payment verification
- **admin**: Full system access

## Notes

- Payments are **simulated** - no real payment gateway integration
- All routes are protected with JWT authentication
- Role-based access control is enforced on both frontend and backend
- MongoDB connection is required for the application to run

## Troubleshooting

### Server won't start
- Check if MongoDB is running (if using local MongoDB)
- Verify `.env` file exists with correct `MONGO_URI`
- Ensure port 5000 is not already in use

### Frontend won't connect to backend
- Verify backend server is running on port 5000
- Check CORS settings in `server.js`
- Ensure API URLs in frontend match backend URL

### Database connection errors
- Verify MongoDB connection string in `.env`
- Check if MongoDB service is running
- For MongoDB Atlas, ensure IP whitelist includes your IP

## License

ISC

## Author

Final Year Project - Turf Booking System
