const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const path = require('path');

// Load environment variables from the root .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Sample products data from frontend
const products = [
  {
    name: "N95 Anti-Pollution Mask Pro",
    description: "Premium N95 mask with advanced filtration for maximum protection",
    fullDescription: "Our flagship N95 mask provides superior protection against PM2.5, PM10, and harmful pollutants. Features a comfortable fit with adjustable straps and a replaceable filter system.",
    price: 499,
    originalPrice: 799,
    discountPercentage: 38, // Calculated as: ((799-499)/799)*100
    images: [
      "https://images.unsplash.com/photo-1584634731339-252c58abf4a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1583943705209-7b0e4d1b2b1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ],
    category: "Masks",
    rating: 5,
    features: [
      "99% filtration efficiency",
      "Comfortable adjustable straps",
      "Replaceable filter cartridges",
      "Breathable material",
      "CE certified"
    ],
    inStock: true
  },
  {
    name: "Smart Air Purifier",
    description: "Compact air purifier with HEPA filter and smart controls",
    fullDescription: "Experience clean air with our smart air purifier featuring HEPA H13 filtration, air quality monitoring, and app control. Perfect for bedrooms and small offices.",
    price: 3999,
    originalPrice: 5999,
    discountPercentage: 33,
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"],
    category: "Air Purifiers",
    rating: 5,
    features: [
      "HEPA H13 filtration",
      "Smart app control",
      "Real-time air quality monitoring",
      "Whisper-quiet operation",
      "Energy efficient"
    ],
    inStock: true
  },
  {
    name: "Replacement Filters (Pack of 3)",
    description: "High-quality replacement filters for all AirNex purifiers",
    fullDescription: "Keep your air purifier running at peak performance with our genuine replacement filters. Each pack contains 3 filters that last up to 6 months each.",
    price: 999,
    originalPrice: 1499,
    discountPercentage: 33,
    images: ["https://images.unsplash.com/photo-1595015427247-29bf44892c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"],
    category: "Accessories",
    rating: 4,
    features: [
      "Compatible with all AirNex purifiers",
      "3 filters per pack",
      "6-month lifespan per filter",
      "Activated carbon layer",
      "Easy to install"
    ],
    inStock: true
  },
  {
    name: "Kids Anti-Pollution Mask",
    description: "Fun and safe anti-pollution mask for children",
    fullDescription: "Designed specifically for children, this mask offers the same protection as our adult masks but in fun colors and patterns that kids love. Features adjustable ear loops and a soft, comfortable fit.",
    price: 399,
    originalPrice: 599,
    discountPercentage: 33,
    images: ["https://images.unsplash.com/photo-1583943705209-7b0e4d1b2b1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"],
    category: "Kids",
    rating: 4,
    features: [
      "Designed for children 5-12 years",
      "Fun colors and patterns",
      "Adjustable ear loops",
      "Soft, breathable material",
      "N95 equivalent protection"
    ],
    inStock: true
  },
  {
    name: "Sports Performance Mask",
    description: "High-performance mask for athletes and active lifestyles",
    fullDescription: "Engineered for high-intensity activities, our sports mask provides excellent airflow while maintaining superior filtration. The ergonomic design prevents fogging and stays in place during movement.",
    price: 699,
    originalPrice: 999,
    discountPercentage: 30,
    images: ["https://images.unsplash.com/photo-1584634731339-252c58abf4a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"],
    category: "Sports",
    rating: 5,
    features: [
      "Ideal for running and workouts",
      "Ergonomic design",
      "Anti-fog technology",
      "Moisture-wicking fabric",
      "Adjustable nose clip"
    ],
    inStock: true
  },
  {
    name: "Car Air Purifier",
    description: "Compact air purifier for your vehicle",
    fullDescription: "Breathe clean air even in traffic with our car air purifier. Features HEPA and activated carbon filters to remove pollutants, odors, and allergens from your vehicle's cabin.",
    price: 2499,
    originalPrice: 3499,
    discountPercentage: 29,
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"],
    category: "Car",
    rating: 4,
    features: [
      "HEPA + activated carbon filter",
      "USB powered",
      "Whisper-quiet operation",
      "Compact design",
      "Ionizer function"
    ],
    inStock: true
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Explicit MongoDB Atlas connection string
    const mongoUri = 'mongodb+srv://volvoro:VOLVOROANURAG098@cluster0.lts5rjd.mongodb.net/air?retryWrites=true&w=majority';
    
    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log('🔗 Using connection string:', 'mongodb+srv://volvoro:*****@cluster0.lts5rjd.mongodb.net/...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      dbName: 'air'
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Please check your internet connection and ensure the MongoDB Atlas cluster is running');
    process.exit(1);
  }
};

// Seed products
const seedProducts = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🧹 Cleared existing products');
    
    // Insert new products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Seeded ${createdProducts.length} products`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

// Run the seed function
seedProducts();
