// Simple test to verify WhatsApp number
console.log('Testing WhatsApp number...');

// Import the service
const { WhatsAppService } = require('./utils/whatsappService.ts');

// Check if we can access the number
console.log('WhatsAppService:', WhatsAppService);
console.log('WHATSAPP_NUMBER:', WhatsAppService.WHATSAPP_NUMBER);

// Test URL creation
const testUrl = `https://wa.me/918434903291?text=Hello`;
console.log('Test URL:', testUrl);
