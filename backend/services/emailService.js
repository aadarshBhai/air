const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send order confirmation email
const sendOrderEmail = async (orderData) => {
  try {
    console.log('📧 Creating email transporter for order...');
    const transporter = createTransporter();
    const receiverEmail = process.env.RECEIVER_EMAIL || 'theairnexpro@gmail.com';
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: receiverEmail,
      subject: `New Order Received - ${orderData.orderId}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">New Order Received!</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${orderData.orderId}</p>
          <p><strong>Product:</strong> ${orderData.productName}</p>
          <p><strong>Price:</strong> ₹${orderData.price}</p>
          <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${orderData.customerInfo.fullName}</p>
          <p><strong>Email:</strong> ${orderData.customerInfo.email}</p>
          <p><strong>Phone:</strong> ${orderData.customerInfo.phoneNumber}</p>
          <p><strong>Address:</strong> ${orderData.customerInfo.shippingAddress}, ${orderData.customerInfo.city}, ${orderData.customerInfo.pincode}</p>
        </div>
        
        ${orderData.paymentScreenshot ? `
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
          <p><strong>Payment Screenshot:</strong> ${orderData.paymentScreenshot.name}</p>
          <p><small>Check uploads folder for the payment screenshot</small></p>
        </div>
        ` : ''}
        
        <div style="margin-top: 30px; padding: 20px; background: #007bff; color: white; border-radius: 8px;">
          <p style="margin: 0;">Please process this order and update the status in the admin dashboard.</p>
        </div>
      </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Order email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending order email:', error);
    console.error('❌ Error details:', error.message);
    return false;
  }
};

// Send contact form email
const sendContactEmail = async (contactData) => {
  try {
    console.log('📧 Creating email transporter for contact form...');
    const transporter = createTransporter();
    const receiverEmail = process.env.RECEIVER_EMAIL || 'theairnexpro@gmail.com';
    
    console.log('📧 SMTP Config:', {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 465,
      user: process.env.SMTP_USER,
      receiver: receiverEmail
    });
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: receiverEmail,
      subject: `New Contact Message - ${contactData.subject}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Message</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
          <p><strong>Subject:</strong> ${contactData.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${contactData.message}</p>
          <p><strong>Date:</strong> ${new Date(contactData.timestamp).toLocaleString()}</p>
        </div>
        <p style="color: #666; font-size: 12px;">This message was sent from the AirNex contact form.</p>
      </div>
      `
    };
    
    console.log('📧 Sending contact email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Contact email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending contact email:', error);
    console.error('❌ Error details:', error.message);
    return false;
  }
};

module.exports = {
  sendOrderEmail,
  sendContactEmail,
};