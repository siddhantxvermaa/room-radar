const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { setUseMongo } = require('./models/modelProvider');
const { performSeed } = require('./routes/seedRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection and auto-seed
async function initBackend() {
  const conn = await connectDB();
  if (conn) {
    setUseMongo(true);
    console.log('📦 Using MongoDB Cloud / Local database');
  } else {
    setUseMongo(false);
    console.log('⚡ [Zero-Setup Mode]: Built-in Embedded Campus Database is ACTIVE.');
    console.log('🎉 Works out-of-the-box with 0 setup, 0 cloud config needed!');
  }

  // Pre-seed all campus demo data so everything works immediately
  try {
    const seedResult = await performSeed();
    console.log(`✅ Loaded ${seedResult.roomsCount} Classrooms, ${seedResult.facultyCount} Faculty Cabins, and ${seedResult.issuesCount} Helpdesk Guides.`);
  } catch (err) {
    console.warn('Seed status:', err.message);
  }
}

initBackend();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/seed', require('./routes/seedRoutes').router);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'RoomRadar Campus API',
    mode: 'Zero-Setup Embedded + MongoDB Ready',
    timestamp: new Date().toISOString()
  });
});

// Production: Serve static Frontend files if built
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  console.log(`🚀 Serving static frontend from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  // Any non-API route serves the frontend index.html
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // 404 handler for undefined API routes in development
  app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 RoomRadar Backend API running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🏫 Nearest Rooms: http://localhost:${PORT}/api/rooms/nearest`);
  console.log(`👨‍🏫 Faculty: http://localhost:${PORT}/api/faculty`);
  console.log(`📋 Helpdesk: http://localhost:${PORT}/api/issues`);
  console.log(`=======================================================`);
});
