const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/User.route');
const transactionRoutes = require('./routes/transaction.route');
const companyRoutes = require('./routes/company.route');
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
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/companies', companyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 