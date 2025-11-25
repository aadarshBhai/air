const Product = require('../models/Product');
const { broadcast } = require('../services/websocketService');
const path = require('path');

// Function to broadcast product updates
const broadcastProductUpdate = (type, data) => {
  if (typeof broadcast === 'function') {
    // Handle DELETE differently - it sends { productId } instead of full product
    if (type === 'PRODUCT_DELETED' && data.productId) {
      console.log(`📢 Broadcasting ${type} event for product:`, data.productId);
      broadcast({ type, productId: data.productId }, type);
      return;
    }
    
    // For CREATE/UPDATE, convert Mongoose document to plain object to trigger transforms (_id -> id)
    const productData = data.toJSON ? data.toJSON() : data;
    
    // Ensure we have an id field
    if (!productData.id && productData._id) {
      productData.id = productData._id.toString();
    }
    
    console.log(`📢 Broadcasting ${type} event for product:`, productData.id || productData._id);
    // Broadcast with product in data - websocketService will wrap it
    broadcast({ product: productData }, type);
  } else {
    console.error('❌ WebSocket broadcast function is not available');
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, inStock, sort, page = 1, limit } = req.query;
    const query = {};

    if (category) query.category = category;
    if (inStock === 'true') query.inStock = true;
    if (inStock === 'false') query.inStock = false;
    if (search) query.$text = { $search: search };

    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const pageNumber = parseInt(page);
    // If no limit is specified, return all products (set a high limit)
    // If limit is specified, use it for pagination
    const pageSize = limit ? parseInt(limit) : 10000; // Large number to get all products when limit not specified
    const skip = (pageNumber - 1) * pageSize;

    const total = await Product.countDocuments(query);
    let products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize)
      .lean();

    // Ensure image URLs are properly formatted
    const apiBase = `${req.protocol}://${req.get('host')}`;
    products = products.map(product => {
      if (product.images && Array.isArray(product.images)) {
        product.images = product.images.map(img => {
          if (!img || typeof img !== 'string') return img;
          
          // If it's already a full URL, return as is
          if (img.startsWith('http://') || img.startsWith('https://')) {
            return img;
          }
          
          // If it starts with /uploads/, make it a full URL
          if (img.startsWith('/uploads/')) {
            return `${apiBase}${img}`;
          }
          
          // If it's a relative path without leading slash, add it
          if (img.startsWith('uploads/')) {
            return `${apiBase}/${img}`;
          }
          
          return img;
        });
      }
      
      // Also handle the single image field if it exists
      if (product.image && typeof product.image === 'string') {
        if (!product.image.startsWith('http://') && !product.image.startsWith('https://')) {
          if (product.image.startsWith('/uploads/')) {
            product.image = `${apiBase}${product.image}`;
          } else if (product.image.startsWith('uploads/')) {
            product.image = `${apiBase}/${product.image}`;
          }
        }
      }
      
      return product;
    });

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    
    // Fix image paths
    if (product.images && Array.isArray(product.images)) {
      product.images = product.images.map(img => {
        if (img && typeof img === 'string' && img.startsWith('/uploads/')) {
          return img.substring(1); // Remove leading slash
        }
        return img;
      });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      fullDescription, 
      price, 
      originalPrice, 
      discountPercentage,
      category, 
      images,
      rating,
      features,
      inStock
    } = req.body;

    if (!name || !price || !images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ success: false, error: 'Missing required fields or images' });
    }

    const product = new Product({
      name,
      description,
      fullDescription: fullDescription || description, // Use description as fallback
      price,
      originalPrice: originalPrice || undefined,
      discountPercentage: discountPercentage || undefined,
      category,
      images, // array of image URLs from upload route
      rating: rating || 0,
      features: Array.isArray(features) ? features : (features ? [features] : []),
      inStock: inStock !== undefined ? inStock : true
    });

    const createdProduct = await product.save();

    // Broadcast new product via WebSocket
    broadcastProductUpdate('PRODUCT_CREATED', createdProduct);

    res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: 'Server Error', message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, images, category, inStock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.images = images || product.images;
    product.category = category || product.category;
    product.inStock = inStock !== undefined ? inStock : product.inStock;
    product.updatedAt = Date.now();

    const updatedProduct = await product.save();

    broadcastProductUpdate('PRODUCT_UPDATED', updatedProduct);

    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete a product (soft delete by setting inStock to false)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    product.inStock = false;
    product.updatedAt = Date.now();

    await product.save();

    // For DELETE, send productId instead of full product
    broadcastProductUpdate('PRODUCT_DELETED', { productId: product._id.toString() });

    res.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
