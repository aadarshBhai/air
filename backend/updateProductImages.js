const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Product = require('./models/Product');

// Product images mapping - matching categories to appropriate images
const categoryImages = {
  'Masks': [
    'https://images.unsplash.com/photo-1584634731339-252c58abf4a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583943705209-7b0e4d1b2b1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'Air Purifiers': [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'Accessories': [
    'https://images.unsplash.com/photo-1595015427247-29bf44892c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'Kids': [
    'https://images.unsplash.com/photo-1583943705209-7b0e4d1b2b1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'Sports': [
    'https://images.unsplash.com/photo-1584634731339-252c58abf4a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'Car': [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ],
  'Electronics': [
    'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&q=80'
  ],
  'Furniture': [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'
  ],
  'Appliances': [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'
  ]
};

// Default placeholder images
const defaultImages = [
  'https://images.unsplash.com/photo-1584634731339-252c58abf4a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
];

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 
      'mongodb+srv://air:VOLVOROANURAG098@cluster0.lts5rjd.mongodb.net/air?retryWrites=true&w=majority';
    
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      dbName: 'air',
      serverSelectionTimeoutMS: 30000
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

const updateProductImages = async () => {
  try {
    await connectDB();
    
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products to update`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      let needsUpdate = false;
      let imagesToSet = [];
      
      // Check if product has images
      if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
        needsUpdate = true;
        
        // Get appropriate images based on category
        if (product.category && categoryImages[product.category]) {
          imagesToSet = categoryImages[product.category];
        } else {
          imagesToSet = defaultImages;
        }
        
        console.log(`📸 Adding images to "${product.name}" (Category: ${product.category || 'N/A'}):`, imagesToSet);
      } else {
        // Check if images need to be converted from single image to array
        const hasValidImages = product.images.some(img => img && typeof img === 'string' && img.trim() !== '');
        if (!hasValidImages) {
          needsUpdate = true;
          imagesToSet = product.category && categoryImages[product.category] 
            ? categoryImages[product.category] 
            : defaultImages;
          console.log(`📸 Replacing invalid images for "${product.name}":`, imagesToSet);
        }
      }
      
      if (needsUpdate) {
        product.images = imagesToSet;
        await product.save();
        updatedCount++;
        console.log(`✅ Updated product: ${product.name}`);
      }
    }
    
    console.log(`\n✅ Successfully updated ${updatedCount} out of ${products.length} products`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating product images:', error);
    process.exit(1);
  }
};

// Run the update
updateProductImages();

