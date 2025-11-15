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
        name: "N95 Mask Pro",
        description: "Premium N95 respirator mask with 5-layer filtration system for maximum protection against airborne particles and pollutants.",
        price: 499,
        category: "masks",
        image: "/images/n95-mask.jpg",
        rating: 4.8,
        reviews: 124,
        inStock: true,
        features: ["5-layer filtration", "99.97% efficiency", "Breathable design", "Adjustable nose clip"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Smart Air Purifier",
        description: "Intelligent air purifier with HEPA filter and real-time air quality monitoring for clean indoor air.",
        price: 3999,
        category: "purifiers",
        image: "/images/air-purifier.jpg",
        rating: 4.9,
        reviews: 89,
        inStock: true,
        features: ["HEPA filter", "Real-time monitoring", "Smart controls", "Silent operation"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "3",
        name: "Sports Mask",
        description: "Lightweight and breathable sports mask designed for active lifestyles with moisture-wicking technology.",
        price: 299,
        category: "masks",
        image: "/images/sports-mask.jpg",
        rating: 4.6,
        reviews: 67,
        inStock: true,
        features: ["Moisture-wicking", "Lightweight", "Secure fit", "Quick-dry"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "4",
        name: "Car Air Purifier",
        description: "Compact car air purifier with dual filtration system to clean the air inside your vehicle.",
        price: 1499,
        category: "purifiers",
        image: "/images/car-purifier.jpg",
        rating: 4.5,
        reviews: 43,
        inStock: true,
        features: ["Dual filtration", "Compact design", "USB powered", "LED indicator"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "5",
        name: "Kids Mask Pack",
        description: "Colorful and comfortable masks designed specifically for children with fun patterns and prints.",
        price: 349,
        category: "masks",
        image: "/images/kids-mask.jpg",
        rating: 4.7,
        reviews: 92,
        inStock: true,
        features: ["Child-friendly design", "Soft material", "Adjustable ear loops", "Fun patterns"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "6",
        name: "Desktop Air Monitor",
        description: "Real-time air quality monitor that tracks PM2.5, humidity, and temperature levels.",
        price: 1999,
        category: "monitors",
        image: "/images/air-monitor.jpg",
        rating: 4.4,
        reviews: 28,
        inStock: true,
        features: ["Real-time monitoring", "PM2.5 detection", "Humidity sensor", "Digital display"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2));
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
