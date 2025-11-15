// backend/server.js

const path = require('path');
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
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || 'airnexpro@gmail.com';

// Debug: Log environment variables (with sensitive info masked)
console.log('Environment variables after loading:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- MONGODB_URI:', MONGODB_URI ? MONGODB_URI.replace(/:[^:]*@/, ':***@') : 'Not set');
console.log('- DB_NAME:', DB_NAME);

// Debug: Check if there are any other .env files being loaded
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

// Force MongoDB Atlas connection string if localhost is detected
if (MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
  console.log('⚠️  Localhost detected in MONGODB_URI, forcing MongoDB Atlas connection');
  const FORCED_URI = 'mongodb+srv://air:VOLVOROANURAG098@cluster0.lts5rjd.mongodb.net/air?retryWrites=true&w=majority';
  console.log('Using forced MongoDB Atlas URI:', FORCED_URI.replace(/:[^:]*@/, ':***@'));
  process.env.MONGODB_URI = FORCED_URI;
}

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set keep-alive timeout
app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=5');
  next();
});

// MongoDB connection function
const connectDB = async () => {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    const options = {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 10000,
    };

    // Disconnect any existing connections before connecting
    await mongoose.disconnect();
    
    // Connect to MongoDB Atlas
    const connection = await mongoose.connect(MONGODB_URI, options);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`📊 Database: ${connection.connection.name}`);
    console.log(`🖥️  Host: ${connection.connection.host}`);
    
    // Test query to list collections
    const collections = await connection.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('🔍 Detailed error:', error);
    console.log('\nPlease check:');
    console.log('1. Internet connection');
    console.log('2. Atlas cluster running');
    console.log('3. IP whitelisted in MongoDB Atlas');
    console.log('4. Credentials in .env are correct');
    console.log('5. Database name is correct');
    process.exit(1);
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
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

// Start server after DB connection
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}`);
  });
  
  // Set server timeout
  server.keepAliveTimeout = 65000; // 65 seconds
  server.headersTimeout = 66000;   // 66 seconds
});
