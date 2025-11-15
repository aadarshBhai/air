const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Use timestamp + original name initially, will be renamed later
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Upload endpoint
router.post('/', upload.single('file'), (req, res) => {
  try {
    console.log('📤 Upload request received:', { body: req.body, file: req.file });
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { orderId, type } = req.body;
    let finalFilename = req.file.filename;
    let fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Rename file if it's a payment screenshot
    if (type === 'payment_screenshot' && orderId) {
      const oldPath = path.join(uploadsDir, req.file.filename);
      finalFilename = `payment${orderId}.jpg`;
      const newPath = path.join(uploadsDir, finalFilename);
      
      // Rename the file
      fs.renameSync(oldPath, newPath);
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/${finalFilename}`;
      console.log('📤 File renamed to:', finalFilename);
    }

    console.log('📤 Upload successful:', { filename: finalFilename, url: fileUrl });
    
    res.status(200).json({
      message: 'File uploaded successfully',
      filename: finalFilename,
      url: fileUrl
    });
  } catch (error) {
    console.error('📤 Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Serve uploaded files
router.get('/:filename', (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    // If file doesn't exist, return a placeholder image
    if (req.params.filename.startsWith('payment')) {
      // Return a simple placeholder for payment screenshots
      const svgPlaceholder = `
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f0f0f0"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="16" fill="#666">
            Payment Screenshot Uploaded
          </text>
          <text x="50%" y="60%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="12" fill="#999">
            ${req.params.filename}
          </text>
        </svg>
      `;
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svgPlaceholder);
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  }
});

module.exports = router;
