const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/emailService');
const fs = require('fs');
const path = require('path');

// Path to contacts data file
const CONTACTS_FILE = path.join(__dirname, '../data/contacts.json');

// Helper function to read contacts
const readContacts = () => {
  try {
    if (fs.existsSync(CONTACTS_FILE)) {
      const data = fs.readFileSync(CONTACTS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return { contacts: [] };
  } catch (error) {
    console.error('Error reading contacts:', error);
    return { contacts: [] };
  }
};

// Helper function to write contacts
const writeContacts = (contacts) => {
  try {
    const dataDir = path.dirname(CONTACTS_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing contacts:', error);
    return false;
  }
};

// GET all contacts (for admin)
router.get('/', (req, res) => {
  try {
    const data = readContacts();
    res.json(data);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

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
      id: `CNT${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      status: 'new'
    };
    
    // Save contact submission
    const contactsData = readContacts();
    contactsData.contacts.unshift(contactData);
    const saved = writeContacts(contactsData);
    
    if (!saved) {
      console.log('⚠️ Could not save contact to file, but will try to send email');
    }
    
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
      // Still return success if contact was saved
      if (saved) {
        res.status(200).json({ 
          message: 'Message received! We will get back to you soon.',
          timestamp: contactData.timestamp
        });
      } else {
        res.status(500).json({ 
          error: 'Failed to send message. Please try again later.' 
        });
      }
    }
  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to process your message. Please try again.' 
    });
  }
});

// DELETE contact message
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting contact message:', id);
    
    // Read existing contacts
    const contactsPath = path.join(__dirname, '../data/contacts.json');
    let contacts = [];
    
    if (fs.existsSync(contactsPath)) {
      const data = fs.readFileSync(contactsPath, 'utf8');
      contacts = JSON.parse(data);
    }
    
    // Remove the contact with matching id
    const initialLength = contacts.length;
    contacts = contacts.filter(contact => contact.id !== id);
    
    if (contacts.length === initialLength) {
      return res.status(404).json({ 
        success: false,
        error: 'Contact message not found' 
      });
    }
    
    // Save updated contacts
    fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2));
    
    console.log('✅ Contact message deleted successfully:', id);
    
    res.json({ 
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting contact message:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete contact message' 
    });
  }
});

module.exports = router;
