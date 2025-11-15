const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const { orderId, type } = req.body;
    let filename;
    
    if (type === 'payment_screenshot') {
      filename = `payment${orderId}.jpg`;
    } else {
      filename = `${Date.now()}-${file.originalname}`;
    }
    
    cb(null, filename);
  }
});

const upload = multer({ storage });

// Upload endpoint
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { orderId, type } = req.body;
    let fileUrl;

    if (type === 'payment_screenshot') {
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/payment${orderId}.jpg`;
    } else {
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    res.json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Serve uploaded files
router.get('/:filename', (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

module.exports = router;
