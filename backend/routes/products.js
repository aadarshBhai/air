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
        name: "N95 Anti-Pollution Mask Pro",
        description: "Premium N95 mask with advanced filtration for maximum protection",
        fullDescription: "Our flagship N95 mask provides superior protection against PM2.5, PM10, and harmful pollutants. Features a comfortable fit with adjustable straps and a replaceable filter system.",
        price: 499,
        originalPrice: 799,
        image: "https://air-couq.onrender.com/uploads/product-mask.jpg",
        category: "Masks",
        rating: 5,
        features: [
          "99% filtration efficiency",
          "Comfortable adjustable straps",
          "Replaceable filter cartridges",
          "Breathable material",
          "CE certified"
        ],
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "2",
        name: "Smart Air Purifier",
        description: "Compact air purifier with HEPA filter and smart controls",
        fullDescription: "Experience clean air with our smart air purifier featuring HEPA H13 filtration, air quality monitoring, and app control. Perfect for bedrooms and small offices.",
        price: 3999,
        originalPrice: 5999,
        image: "https://air-couq.onrender.com/uploads/product-purifier.jpg",
        category: "Air Purifiers",
        rating: 5,
        features: [
          "HEPA H13 filtration",
          "Real-time air quality display",
          "Smart app control",
          "Ultra-quiet operation",
          "Energy efficient"
        ],
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "3",
        name: "Professional Respirator Mask",
        description: "Industrial-grade respirator with dual filter protection",
        fullDescription: "Designed for maximum protection in high-pollution environments. Features dual filtration cartridges and a comfortable silicone face seal.",
        price: 1299,
        originalPrice: 1899,
        image: "https://air-couq.onrender.com/uploads/product-respirator.jpg",
        category: "Masks",
        rating: 5,
        features: [
          "Dual filter cartridges",
          "Silicone face seal",
          "Adjustable head straps",
          "Long-lasting filters",
          "Professional grade"
        ],
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "4",
        name: "Kids Anti-Pollution Mask",
        description: "Specially designed comfortable mask for children",
        fullDescription: "Keep your children safe with our specially designed kids' mask. Features fun colors, comfortable fit, and high-efficiency filtration.",
        price: 349,
        originalPrice: 549,
        image: "https://air-couq.onrender.com/uploads/product-mask.jpg",
        category: "Masks",
        rating: 5,
        features: [
          "Child-friendly design",
          "Soft breathable material",
          "Adjustable ear loops",
          "Fun colors available",
          "Safe materials"
        ],
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "5",
        name: "Car Air Purifier",
        description: "Portable air purifier for your vehicle",
        fullDescription: "Compact car air purifier that fits in your cup holder. Features USB charging and effective air cleaning for your daily commute.",
        price: 1499,
        originalPrice: 2299,
        image: "https://air-couq.onrender.com/uploads/product-purifier.jpg",
        category: "Air Purifiers",
        rating: 4,
        features: [
          "Compact cup holder design",
          "USB powered",
          "Negative ion technology",
          "Low noise operation",
          "Easy to use"
        ],
        inStock: true,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
      },
      {
        id: "6",
        name: "Replacement Filter Pack",
        description: "Pack of 10 replacement filters for masks",
        fullDescription: "High-quality replacement filters compatible with all AirNex masks. Pack includes 10 filters for extended protection.",
        price: 299,
        originalPrice: 499,
        image: "https://air-couq.onrender.com/uploads/product-mask.jpg",
        category: "Accessories",
        rating: 5,
        features: [
          "Pack of 10 filters",
          "Universal fit",
          "High filtration efficiency",
          "Easy to replace",
          "Long shelf life"
        ],
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
