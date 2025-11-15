const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/emailService');

// POST contact form
router.post('/', async (req, res) => {
  try {
    console.log('📧 Contact form submission received:', req.body);
    
    const { name, email, phone, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('❌ Validation failed - missing fields:', { name: !!name, email: !!email, subject: !!subject, message: !!message });
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
    
    console.log('📧 Sending contact email with data:', contactData);
    
    // Send email notification
    const emailSent = await sendContactEmail(contactData);
    
    if (emailSent) {
      console.log('✅ Contact email sent successfully');
      res.status(200).json({ 
        message: 'Message sent successfully! We will get back to you soon.',
        timestamp: contactData.timestamp
      });
    } else {
      console.log('❌ Failed to send contact email');
      res.status(500).json({ 
        error: 'Failed to send message. Please try again later.' 
      });
    }
  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to process your message. Please try again.' 
    });
  }
});

module.exports = router;
