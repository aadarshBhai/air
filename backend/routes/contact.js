const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/emailService');

// POST contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, subject, message' 
      });
    }
    
    const contactData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString()
    };
    
    // Send email notification
    const emailSent = await sendContactEmail(contactData);
    
    if (emailSent) {
      res.status(200).json({ 
        message: 'Message sent successfully! We will get back to you soon.',
        timestamp: contactData.timestamp
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to send message. Please try again later.' 
      });
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ 
      error: 'Failed to process your message. Please try again.' 
    });
  }
});

module.exports = router;
