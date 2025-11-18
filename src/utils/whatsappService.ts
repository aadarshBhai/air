import { FileUploadService } from './fileUploadService';

interface OrderData {
  orderId: string;
  productName: string;
  price: number;
  customerInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
    shippingAddress: string;
    city: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentScreenshot: File | null;
}

export class WhatsAppService {
  private static readonly WHATSAPP_NUMBER = "918544635259"; // User's actual number
  
  // Debug: Check if number is accessible
  static debugNumber() {
    console.log('🔍 Class-level debug - WHATSAPP_NUMBER:', this.WHATSAPP_NUMBER);
    console.log('🔍 Class-level debug - typeof:', typeof this.WHATSAPP_NUMBER);
    return this.WHATSAPP_NUMBER;
  }

  static formatOrderMessage(orderData: OrderData, screenshotUrl: string = ''): string {
    const paymentScreenshotText = screenshotUrl
      ? `${screenshotUrl}`
      : '📸 Payment screenshot not uploaded';

    const message = `🛒 NEW ORDER RECEIVED 🛒%0A%0A` +
      `📋 Order ID: ${orderData.orderId}%0A` +
      `👤 Name: ${orderData.customerInfo.fullName}%0A` +
      `📞 Phone: ${orderData.customerInfo.phoneNumber}%0A` +
      `📧 Email: ${orderData.customerInfo.email}%0A%0A` +
      `🏠 Address:%0A` +
      `${orderData.customerInfo.shippingAddress}%0A` +
      `${orderData.customerInfo.city}, ${orderData.customerInfo.pincode}%0A%0A` +
      `💳 Payment Method: ${orderData.paymentMethod.toUpperCase()}%0A` +
      `📸 Payment Screenshot:%0A` +
      `${paymentScreenshotText}%0A%0A` +
      `🚀 Please verify & process the order!`;

    return message;
  }

  static async sendOrderToWhatsApp(orderData: OrderData): Promise<void> {
    try {
      let screenshotUrl = '';
      
      console.log('🚀 Starting WhatsApp order send process...');
      console.log('Order data:', orderData);
      
      // Upload payment screenshot if available
      if (orderData.paymentScreenshot) {
        console.log('📸 Uploading payment screenshot...');
        try {
          screenshotUrl = await FileUploadService.uploadFileWithFallback(orderData.paymentScreenshot, orderData.orderId);
          console.log('✅ Screenshot uploaded successfully:', screenshotUrl);
        } catch (error) {
          console.error('❌ Failed to upload screenshot:', error);
          screenshotUrl = 'Upload failed - please check manually';
        }
      }
      
      // Format the message with the screenshot URL
      const message = this.formatOrderMessage(orderData, screenshotUrl);
      console.log('📝 Formatted message:', message);
      
      // Create WhatsApp URL
      const phoneNumber = this.WHATSAPP_NUMBER;
      console.log('🔍 Debug - WHATSAPP_NUMBER value:', phoneNumber);
      console.log('🔍 Debug - typeof WHATSAPP_NUMBER:', typeof phoneNumber);
      console.log('🔍 Debug - phoneNumber length:', phoneNumber ? phoneNumber.length : 'undefined');
      
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      console.log('📱 WhatsApp URL:', whatsappUrl);
      console.log('📞 Sending to number:', phoneNumber);
      
      // Open WhatsApp in a new tab
      const newWindow = window.open(whatsappUrl, '_blank');
      console.log('🪟 WhatsApp window opened:', newWindow ? 'Success' : 'Failed (popup blocked?)');
      
      // Fallback: If WhatsApp doesn't open, copy message to clipboard and show alternatives
      if (!newWindow) {
        console.log('📋 WhatsApp blocked, copying message to clipboard...');
        try {
          await navigator.clipboard.writeText(message);
          
          // Create alternative links
          const webWhatsAppUrl = `https://web.whatsapp.com/send?phone=${this.WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
          const directMessage = `📱 WhatsApp Options:\n\n1. Open WhatsApp Web: ${webWhatsAppUrl}\n2. Open WhatsApp App and paste message\n3. Message copied to clipboard below:\n\n${message}`;
          
          alert(`WhatsApp was blocked by browser. Message copied to clipboard!\n\nAlternative: Open WhatsApp Web directly:\n${webWhatsAppUrl}`);
          console.log('✅ Message copied to clipboard successfully');
          console.log('🌐 WhatsApp Web URL:', webWhatsAppUrl);
        } catch (clipboardError) {
          console.error('❌ Failed to copy to clipboard:', clipboardError);
          alert('WhatsApp was blocked and clipboard access failed. Please check console for the message.');
        }
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('❌ Error sending to WhatsApp:', error);
      throw new Error('Failed to send order to WhatsApp');
    }
  }

  static updateWhatsAppNumber(newNumber: string): void {
    // This would typically be stored in environment variables
    // For now, you can manually update the WHATSAPP_NUMBER constant above
    console.log('WhatsApp number updated to:', newNumber);
  }
}
