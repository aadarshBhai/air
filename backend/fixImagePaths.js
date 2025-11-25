// backend/fixImagePaths.js
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB with better options
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/air', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
    });
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

const Product = require('./models/Product');

async function fixImagePaths() {
  try {
    // Connect to MongoDB first
    const isConnected = await connectDB();
    if (!isConnected) return;
    
    console.log('🔍 Starting to fix image paths...');
    // Get all products
    const products = await Product.find({});
    let updatedCount = 0;

    for (const product of products) {
      let needsUpdate = false;
      
      // Fix main image
      if (product.image && (product.image.startsWith('blob:http') || product.image.includes('localhost:8080'))) {
        product.image = 'uploads/placeholder-product.png';
        needsUpdate = true;
      }

      // Fix images array if it exists
      if (product.images && Array.isArray(product.images)) {
        product.images = product.images.map(img => 
          (img && (img.startsWith('blob:http') || img.includes('localhost:8080'))) 
            ? 'uploads/placeholder-product.png' 
            : img
        );
        needsUpdate = true;
      }

      // Save if any changes were made
      if (needsUpdate) {
        await product.save();
        updatedCount++;
        console.log(`✅ Updated product: ${product.name || product._id}`);
      }
    }

    console.log(`\n✅ Fixed ${updatedCount} products`);
  } catch (error) {
    console.error('❌ Error fixing image paths:', error);
  } finally {
    // Close the connection when done
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 Disconnected from MongoDB');
    }
    process.exit(0);
  }
}

fixImagePaths();
