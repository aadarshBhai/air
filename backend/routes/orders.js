const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { sendOrderEmail } = require('../services/emailService');

// Data file for storing orders (simple file-based storage for now)
const ORDERS_FILE = path.join(__dirname, '../data/orders.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize orders file if it doesn't exist
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify({ orders: [] }, null, 2));
}

// Helper functions
const readOrders = () => {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(data).orders || [];
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
};

const writeOrders = (orders) => {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify({ orders }, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing orders:', error);
    return false;
  }
};

// GET all orders (for admin)
router.get('/', (req, res) => {
  try {
    const orders = readOrders();
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET single order by ID
router.get('/:orderId', (req, res) => {
  try {
    const orders = readOrders();
    const order = orders.find(o => o.orderId === req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// POST new order
router.post('/', (req, res) => {
  try {
    const orderData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'pending' // pending, confirmed, shipped, delivered
    };
    
    const orders = readOrders();
    orders.push(orderData);
    
    if (writeOrders(orders)) {
      // Send email notification
      sendOrderEmail(orderData);
      
      res.status(201).json({ 
        message: 'Order created successfully',
        order: orderData
      });
    } else {
      res.status(500).json({ error: 'Failed to save order' });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// UPDATE order status
router.patch('/:orderId/status', (req, res) => {
  try {
    const { status } = req.body;
    const orders = readOrders();
    
    const orderIndex = orders.findIndex(o => o.orderId === req.params.orderId);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    if (writeOrders(orders)) {
      res.json({ 
        message: 'Order status updated successfully',
        order: orders[orderIndex]
      });
    } else {
      res.status(500).json({ error: 'Failed to update order' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
