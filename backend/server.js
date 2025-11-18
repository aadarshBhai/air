// backend/server.js

const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Load environment variables from root .env
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);

// Debug: Log raw environment variables before dotenv loads
console.log('Raw MONGODB_URI before dotenv:', process.env.MONGODB_URI || 'Not set');

// Load environment variables
require('dotenv').config({ path: envPath, override: true });

// Debug: Log all environment variables from .env
console.log('All environment variables from .env:');
console.log(require('fs').readFileSync(envPath, 'utf8'));

// Set MongoDB connection string with fallback to Atlas
const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb+srv://air:VOLVOROANURAG098@cluster0.lts5rjd.mongodb.net/air?retryWrites=true&w=majority';

const DB_NAME = process.env.DB_NAME || 'air';
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || 'theairnexpro@gmail.com';

// Debug: Log environment variables (with sensitive info masked)
console.log('Environment variables after loading:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- MONGODB_URI:', MONGODB_URI ? MONGODB_URI.replace(/:[^:]*@/, ':***@') : 'Not set');
console.log('- DB_NAME:', DB_NAME);

// Debug: Check if there are any other .env files being loaded
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

// Use MongoDB URI from environment as-is

if (!MONGODB_URI) {
  console.error('❌ MongoDB URI is not defined in environment variables!');
  process.exit(1);
}

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://localhost:8080',
    'https://airnexpro.store',
    'https://www.airnexpro.store'
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Set keep-alive timeout
app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=5');
  next();
});

// MongoDB connection function (optional)
const connectDB = async () => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    const options = {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 5000, // Short timeout for development
    };

    // Disconnect any existing connections before connecting
    await mongoose.disconnect();
    
    // Connect to MongoDB
    const connection = await mongoose.connect(MONGODB_URI, options);
    console.log('✅ Successfully connected to MongoDB!');
    console.log(`📊 Database: ${connection.connection.name}`);
    console.log(`🖥️  Host: ${connection.connection.host}`);
    
    // Test query to list collections
    const collections = await connection.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
  } catch (error) {
    console.log('⚠️ MongoDB connection failed, continuing without database...');
    console.log('Using file storage only');
    // Don't throw error, just continue without MongoDB
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
  // Trigger redeploy
});

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Test uploads directory
app.get('/test-uploads', (req, res) => {
  try {
    const uploadsPath = path.join(__dirname, 'uploads');
    const exists = fs.existsSync(uploadsPath);
    let files = [];
    
    if (exists) {
      files = fs.readdirSync(uploadsPath);
    }
    
    res.json({
      uploadsPath,
      exists,
      files,
      dirname: __dirname
    });
  } catch (error) {
    console.error('Error checking uploads:', error);
    res.status(500).json({ 
      error: error.message,
      uploadsPath: path.join(__dirname, 'uploads'),
      dirname: __dirname
    });
  }
});

// Admin routes (example)
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Products routes
const productsRoutes = require('./routes/products');
app.use('/api/products', productsRoutes);

// Orders routes
const ordersRoutes = require('./routes/orders');
app.use('/api/orders', ordersRoutes);

// Contact routes
const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);

// Upload routes
const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

// Serve uploaded files
app.use('/uploads', (req, res, next) => {
  console.log('📁 Serving file from uploads:', req.path);
  const uploadsPath = path.join(__dirname, 'uploads');
  console.log('📁 Uploads directory:', uploadsPath);
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Start server (MongoDB optional for development)
connectDB().catch((err) => {
  console.log('⚠️ MongoDB connection failed, continuing without database...');
  console.log('Using file storage only');
}).then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}`);
  });
  
  // Set server timeout
  server.keepAliveTimeout = 65000; // 65 seconds
  server.headersTimeout = 66000;   // 66 seconds
});
