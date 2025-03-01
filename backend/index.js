// import express from 'express';
// const cors = require('cors');
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
//import nessieRoutes from './routes/nessie.routes.js';
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();
const userRoutes = require('./routes/User.route');
const transactionRoutes = require('./routes/transaction.route');
const companyRoutes = require('./routes/company.route');
const nessieRoutes = require('./routes/nessie.routes');
const receiptRoutes = require('./routes/receipt.routes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI ;
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the MERN stack application' });
});

// Routes will go here
// app.use('/api/your-route', yourRouteHandler);

app.use('/api/nessie', nessieRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/receipts', receiptRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 