const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Robust CORS middleware: handles preflight OPTIONS immediately and reflects requesting origin
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  // Immediately respond to preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection check middleware
app.use((req, res, next) => {
  // Skip check for health check and root endpoints
  if (req.path === '/api/health' || req.path === '/') {
    return next();
  }
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is connecting or MONGODB_URI is not set on Render. Please verify MONGODB_URI in Render Environment tab.',
    });
  }
  next();
});

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/matches', require('./routes/matchingRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/exchanges', require('./routes/exchangeRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.status(200).json({
    status: 'OK',
    app: 'SkillSwap API',
    database: states[dbState] || 'unknown',
    time: new Date().toISOString(),
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.send('SkillSwap Backend API is running smoothly.');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 SkillSwap Server is listening on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});
