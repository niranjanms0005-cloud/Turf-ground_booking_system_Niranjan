/**
 * Sample Data Seeding Script
 * 
 * This script creates sample data for testing and demonstration.
 * Run with: node scripts/seedData.js
 * 
 * Note: Make sure MongoDB is running and .env file is configured
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Ground = require('../models/Ground');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Ground.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});

    // Create Users
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('123456', 10);

    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user',
      },
      {
        name: 'Jane Manager',
        email: 'groundmanager@example.com',
        password: hashedPassword,
        role: 'groundManager',
      },
      {
        name: 'Bob Payment',
        email: 'paymentmanager@example.com',
        password: hashedPassword,
        role: 'paymentManager',
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      },
      {
        name: 'Alice Player',
        email: 'alice@example.com',
        password: hashedPassword,
        role: 'user',
      },
    ]);

    console.log(`Created ${users.length} users`);

    // Find users by role
    const regularUser = users.find(u => u.role === 'user' && u.email === 'user@example.com');
    const groundManager = users.find(u => u.role === 'groundManager');
    const admin = users.find(u => u.role === 'admin');

    // Create Grounds
    console.log('Creating grounds...');
    const grounds = await Ground.insertMany([
      {
        groundName: 'City Sports Complex',
        location: 'Main Street, Downtown',
        pricePerSlot: 500,
        availableSlots: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00'],
        managerID: groundManager._id,
        isActive: true,
      },
      {
        groundName: 'Elite Football Ground',
        location: 'Sports Avenue',
        pricePerSlot: 800,
        availableSlots: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '16:00-17:00', '17:00-18:00'],
        managerID: groundManager._id,
        isActive: true,
      },
      {
        groundName: 'Community Turf',
        location: 'Park Road',
        pricePerSlot: 300,
        availableSlots: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '18:00-19:00'],
        managerID: groundManager._id,
        isActive: true,
      },
    ]);

    console.log(`Created ${grounds.length} grounds`);

    // Create Bookings
    console.log('Creating bookings...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookings = await Booking.insertMany([
      {
        userID: regularUser._id,
        groundID: grounds[0]._id,
        bookingDate: tomorrow,
        timeSlot: '09:00-10:00',
        status: 'Pending',
        paymentStatus: 'Unpaid',
      },
      {
        userID: regularUser._id,
        groundID: grounds[1]._id,
        bookingDate: tomorrow,
        timeSlot: '10:00-11:00',
        status: 'Approved',
        paymentStatus: 'Paid',
      },
      {
        userID: users.find(u => u.email === 'alice@example.com')._id,
        groundID: grounds[0]._id,
        bookingDate: tomorrow,
        timeSlot: '10:00-11:00',
        status: 'Approved',
        paymentStatus: 'Unpaid',
      },
    ]);

    console.log(`Created ${bookings.length} bookings`);

    // Create Payments
    console.log('Creating payments...');
    const payments = await Payment.insertMany([
      {
        bookingID: bookings[1]._id,
        amount: grounds[1].pricePerSlot,
        paymentMethod: 'Online',
        transactionID: `TXN${Date.now()}001`,
        paymentStatus: 'Success',
        verifiedBy: null,
      },
    ]);

    console.log(`Created ${payments.length} payments`);

    console.log('\n✅ Sample data seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Regular User:');
    console.log('  Email: user@example.com');
    console.log('  Password: 123456');
    console.log('\nGround Manager:');
    console.log('  Email: groundmanager@example.com');
    console.log('  Password: 123456');
    console.log('\nPayment Manager:');
    console.log('  Email: paymentmanager@example.com');
    console.log('  Password: 123456');
    console.log('\nAdmin:');
    console.log('  Email: admin@example.com');
    console.log('  Password: 123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
