const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Data file for storing products
const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper functions
const readProducts = () => {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
      return JSON.parse(data);
    }
    // Return initial products if file doesn't exist
    const initialProducts = [
      {
        id: "1",
        name: "Wireless Bluetooth Earbuds",
        description: "Premium quality wireless earbuds with noise cancellation and 24-hour battery life",
        fullDescription: "Experience true wireless freedom with our premium Bluetooth earbuds. Features advanced noise cancellation, crystal-clear audio quality, and an impressive 24-hour battery life with the charging case. IPX5 water resistance makes them perfect for workouts and outdoor activities.",
        price: 2999,
        originalPrice: 3999,
        image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&q=80",
        category: "Electronics",
        rating: 4.5,
        reviews: 234,
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "2",
        name: "Smart Fitness Watch",
        description: "Track your health and fitness goals with this advanced smartwatch",
        fullDescription: "Stay on top of your fitness journey with our comprehensive smartwatch. Monitor heart rate, track workouts, count steps, and receive notifications right on your wrist. Water-resistant design with 7-day battery life.",
        price: 4999,
        originalPrice: 6999,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
        category: "Electronics",
        rating: 4.3,
        reviews: 189,
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "3",
        name: "Professional DSLR Camera",
        description: "Capture stunning photos with this professional DSLR camera",
        fullDescription: "Unleash your creativity with this professional-grade DSLR camera featuring a 45MP full-frame sensor, 4K video recording, and advanced autofocus system. Perfect for professional photographers and enthusiasts.",
        price: 45000,
        originalPrice: 55000,
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
        category: "Electronics",
        rating: 4.8,
        reviews: 92,
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "4",
        name: "Ergonomic Office Chair",
        description: "Comfortable and stylish office chair with lumbar support",
        fullDescription: "Work in comfort with our ergonomic office chair designed for long hours. Features adjustable lumbar support, breathable mesh back, 4D armrests, and smooth-rolling casters. Supports up to 150kg.",
        price: 7999,
        originalPrice: 9999,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
        category: "Furniture",
        rating: 4.2,
        reviews: 156,
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "5",
        name: "Portable Power Bank 20000mAh",
        description: "Never run out of battery with this high-capacity power bank",
        fullDescription: "Stay powered up anywhere with our 20000mAh power bank. Fast charging support for multiple devices simultaneously. Compact design with digital display showing remaining battery percentage.",
        price: 1499,
        originalPrice: 1999,
        image: "https://images.unsplash.com/photo-1596495578526-8a612b4c5296?w=800&q=80",
        category: "Electronics",
        rating: 4.4,
        reviews: 312,
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "6",
        name: "Luxury Leather Wallet",
        description: "Genuine leather wallet with RFID protection",
        fullDescription: "Handcrafted from premium genuine leather, this wallet offers both style and security. Features RFID blocking technology, multiple card slots, and a sleek minimalist design that fits comfortably in your pocket.",
        price: 1999,
        originalPrice: 2499,
        image: "https://images.unsplash.com/photo-1627123427772-064252e00fc4?w=800&q=80",
        category: "Accessories",
        rating: 4.6,
        reviews: 78,
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "7",
        name: "Wireless Charging Pad",
        description: "Fast wireless charging pad compatible with all Qi-enabled devices",
        fullDescription: "Charge your devices effortlessly with our sleek wireless charging pad. Supports 15W fast charging, compatible with all Qi-enabled smartphones. Features LED indicator and overheat protection.",
        price: 999,
        originalPrice: 1499,
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80",
        category: "Electronics",
        rating: 4.1,
        reviews: 145,
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "8",
        name: "Yoga Mat Premium",
        description: "Extra thick, non-slip yoga mat with alignment markers",
        fullDescription: "Enhance your yoga practice with our premium 6mm thick yoga mat. Features non-slip surface, alignment markers for proper posture, and eco-friendly materials. Includes carrying strap.",
        price: 1499,
        originalPrice: 1999,
        image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
        category: "Sports",
        rating: 4.5,
        reviews: 203,
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "9",
        name: "Bluetooth Speaker Waterproof",
        description: "Portable waterproof Bluetooth speaker with 360° sound",
        fullDescription: "Party anywhere with this rugged waterproof Bluetooth speaker. Delivers immersive 360° sound, features dynamic RGB lights, and provides 12 hours of playtime. IPX7 waterproof rating.",
        price: 2499,
        originalPrice: 3499,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
        category: "Electronics",
        rating: 4.3,
        reviews: 267,
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "10",
        name: "Designer Sunglasses",
        description: "UV400 protection designer sunglasses with polarized lenses",
        fullDescription: "Protect your eyes in style with these designer sunglasses. Features UV400 protection, polarized lenses to reduce glare, and a lightweight titanium frame. Comes with premium case.",
        price: 3999,
        originalPrice: 5999,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f28150b2?w=800&q=80",
        category: "Accessories",
        rating: 4.7,
        reviews: 124,
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "11",
        name: "Smart Home Security Camera",
        description: "WiFi-enabled security camera with night vision and motion detection",
        fullDescription: "Keep your home secure with our smart security camera. Features 1080p HD video, night vision, motion detection alerts, and two-way audio. Works with Alexa and Google Assistant.",
        price: 3499,
        originalPrice: 4999,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        category: "Electronics",
        rating: 4.4,
        reviews: 198,
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "12",
        name: "Premium Coffee Maker",
        description: "Programmable coffee maker with built-in grinder",
        fullDescription: "Start your day right with fresh coffee from our premium coffee maker. Features built-in grinder, programmable timer, thermal carafe, and multiple strength settings. Makes up to 12 cups.",
        price: 6999,
        originalPrice: 8999,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
        category: "Appliances",
        rating: 4.6,
        reviews: 156,
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "13",
        name: "Gaming Mouse RGB",
        description: "High-precision gaming mouse with customizable RGB lighting",
        fullDescription: "Dominate the game with our professional gaming mouse. Features 16000 DPI sensor, programmable buttons, customizable RGB lighting, and ergonomic design for extended gaming sessions.",
        price: 1799,
        originalPrice: 2499,
        image: "https://images.unsplash.com/photo-1615669757714-f9b3d66f762b?w=800&q=80",
        category: "Electronics",
        rating: 4.5,
        reviews: 289,
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "14",
        name: "Stainless Steel Water Bottle",
        description: "Insulated stainless steel water bottle keeps drinks cold for 24 hours",
        fullDescription: "Stay hydrated in style with our insulated water bottle. Double-wall vacuum insulation keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof design with wide mouth.",
        price: 899,
        originalPrice: 1299,
        image: "https://images.unsplash.com/photo-1602143407151-71124268d691?w=800&q=80",
        category: "Sports",
        rating: 4.2,
        reviews: 412,
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "15",
        name: "Wireless Keyboard Mechanical",
        description: "Premium mechanical wireless keyboard with blue switches",
        fullDescription: "Type in comfort and style with our premium mechanical keyboard. Features tactile blue switches, per-key RGB backlighting, wireless connectivity, and long battery life. Perfect for typing and gaming.",
        price: 3999,
        originalPrice: 5499,
        image: "https://images.unsplash.com/photo-1587829742455-2d5215a4d609?w=800&q=80",
        category: "Electronics",
        rating: 4.7,
        reviews: 176,
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      }
    ];
    // Try to write file but don't fail if it doesn't work
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2));
    } catch (writeError) {
      console.log('Could not write products file, using memory fallback:', writeError.message);
    }
    return initialProducts;
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

const writeProducts = (products) => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing products:', error);
    return false;
  }
};

// GET all products
router.get('/', (req, res) => {
  try {
    const products = readProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product by ID
router.get('/:id', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST new product (admin only)
router.post('/', (req, res) => {
  try {
    const productData = {
      ...req.body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const products = readProducts();
    products.push(productData);
    
    if (writeProducts(products)) {
      res.status(201).json({ 
        message: 'Product created successfully',
        product: productData
      });
    } else {
      res.status(500).json({ error: 'Failed to save product' });
    }
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product (admin only)
router.put('/:id', (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    products[index] = {
      ...products[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    if (writeProducts(products)) {
      res.json({ 
        message: 'Product updated successfully',
        product: products[index]
      });
    } else {
      res.status(500).json({ error: 'Failed to update product' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product (admin only)
router.delete('/:id', (req, res) => {
  try {
    const products = readProducts();
    const filteredProducts = products.filter(p => p.id !== req.params.id);
    
    if (filteredProducts.length === products.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (writeProducts(filteredProducts)) {
      res.json({ 
        message: 'Product deleted successfully'
      });
    } else {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
