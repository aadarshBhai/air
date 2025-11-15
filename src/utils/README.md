# WhatsApp Order Integration

## Overview
This system handles sending order details and payment screenshots to WhatsApp for order processing.

## How it works

1. **Order Submission**: Customer fills out the checkout form with their details and uploads a payment screenshot
2. **Screenshot Upload**: The payment screenshot is uploaded to your server (simulated for demo)
3. **WhatsApp Message**: A formatted WhatsApp message is sent with all order details and the screenshot URL
4. **Order Processing**: You receive the message and can verify the payment screenshot

## Setup Instructions

### 1. Update WhatsApp Number
Edit `src/utils/whatsappService.ts` and update the `WHATSAPP_NUMBER` constant:
```typescript
private static readonly WHATSAPP_NUMBER = "YOUR_PHONE_NUMBER"; // Without + or 00
```

### 2. Set Up File Upload Server
Create an upload endpoint that accepts multipart form data. The endpoint should:
- Accept `file`, `orderId`, and `type` fields
- Save the file to your uploads directory
- Return a JSON response with the file URL

Example server response:
```json
{
  "url": "https://airnexpro.store/uploads/payment123.jpg"
}
```

### 3. Update Upload URL
Edit `src/utils/fileUploadService.ts` and update the `UPLOAD_URL`:
```typescript
private static readonly UPLOAD_URL = 'https://airnexpro.store/api/upload';
```

## Message Format
The WhatsApp message will be formatted as:
```
🛒 NEW ORDER RECEIVED 🛒

📋 Order ID: ORD123456
👤 Name: John Doe
📞 Phone: +91 98765 43210
📧 Email: john@example.com

🏠 Address:
123 Main Street
Mumbai, 400001

💳 Payment Method: UPI
📸 Payment Screenshot:
https://airnexpro.store/uploads/payment123.jpg

🚀 Please verify & process the order!
```

## Features
- ✅ Clean, readable message format
- ✅ Automatic screenshot upload
- ✅ Fallback to local URL if upload fails
- ✅ Progress indicators for uploads
- ✅ Download option for screenshots
- ✅ Error handling and user feedback

## Testing
The system includes simulated upload functionality for testing. To test with real uploads:
1. Set up your upload server
2. Update the UPLOAD_URL
3. Test the complete flow
