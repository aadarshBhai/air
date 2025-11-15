const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
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
  const transporter = createTransporter();
  const receiverEmail = process.env.RECEIVER_EMAIL || 'airnexpro@gmail.com';
  
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: receiverEmail,
    subject: `New Order Received - ${orderData.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Order Received</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${orderData.orderId}</p>
          <p><strong>Product:</strong> ${orderData.productName}</p>
          <p><strong>Price:</strong> ₹${orderData.price}</p>
          <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
          <p><strong>Status:</strong> ${orderData.status}</p>
          <p><strong>Date:</strong> ${new Date(orderData.createdAt).toLocaleString()}</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${orderData.customerInfo.fullName}</p>
          <p><strong>Email:</strong> ${orderData.customerInfo.email}</p>
          <p><strong>Phone:</strong> ${orderData.customerInfo.phoneNumber}</p>
          <p><strong>Shipping Address:</strong></p>
          <p>${orderData.customerInfo.shippingAddress}</p>
          <p>${orderData.customerInfo.city} - ${orderData.customerInfo.pincode}</p>
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
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Order email sent successfully to:', receiverEmail);
    return true;
  } catch (error) {
    console.error('❌ Failed to send order email:', error);
    return false;
  }
};

// Send contact form email
const sendContactEmail = async (contactData) => {
  const transporter = createTransporter();
  const receiverEmail = process.env.RECEIVER_EMAIL || 'airnexpro@gmail.com';
  
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: receiverEmail,
    subject: `New Contact Message - ${contactData.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Message</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Message Details</h3>
          <p><strong>Subject:</strong> ${contactData.subject}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Sender Information</h3>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Phone:</strong> ${contactData.phone}</p>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #28a745; margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap;">${contactData.message}</p>
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: #007bff; color: white; border-radius: 8px;">
          <p style="margin: 0;">Please respond to this inquiry at your earliest convenience.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Contact email sent successfully to:', receiverEmail);
    return true;
  } catch (error) {
    console.error('❌ Failed to send contact email:', error);
    return false;
  }
};

module.exports = {
  sendOrderEmail,
  sendContactEmail,
};
