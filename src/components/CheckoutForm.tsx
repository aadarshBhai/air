import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface CheckoutFormProps {
  productName: string;
  price: number;
}

export const CheckoutForm = ({ productName, price }: CheckoutFormProps) => {
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    phoneNumber: string;
    shippingAddress: string;
    city: string;
    pincode: string;
    paymentMethod: string;
    paymentScreenshot: File | null;
  }>({
    fullName: "",
    email: "",
    phoneNumber: "",
    shippingAddress: "",
    city: "",
    pincode: "",
    paymentMethod: "upi",
    paymentScreenshot: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate order ID
      const orderId = `ORD${Date.now().toString().slice(-6)}`;
      
      // Create order data object
      const newOrderData = {
        orderId,
        productName,
        price,
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          shippingAddress: formData.shippingAddress,
          city: formData.city,
          pincode: formData.pincode,
        },
        paymentMethod: formData.paymentMethod,
        paymentScreenshot: formData.paymentScreenshot,
      };

      // Save order to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrderData)
      });

      if (response.ok) {
        const savedOrder = await response.json();
        setOrderData(savedOrder.order);
        setOrderSubmitted(true);
        
        toast.success("Order placed successfully!", {
          description: `Order ID: ${orderId}. We will process your order soon.`
        });
      } else {
        const error = await response.json();
        toast.error("Failed to place order", {
          description: error.error || "Please try again."
        });
      }

      // Upload payment screenshot if provided
      if (formData.paymentScreenshot) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', formData.paymentScreenshot);
        formDataUpload.append('orderId', orderId);
        formDataUpload.append('type', 'payment_screenshot');

        try {
          const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL || 'https://air-couq.onrender.com'}/api/upload`, {
            method: 'POST',
            body: formDataUpload,
          });
          
          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            console.log('Payment screenshot uploaded:', uploadResult.url);
          }
        } catch (uploadError) {
          console.error('Failed to upload payment screenshot:', uploadError);
          // Continue even if upload fails
        }
      }

      setOrderData(newOrderData);
      setOrderSubmitted(true);
      
      toast.success("Order placed successfully! We'll contact you soon.");

    } catch (error) {
      console.error('Order submission error:', error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      paymentScreenshot: file
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {orderSubmitted ? (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-xl font-semibold text-green-600">Order Placed Successfully!</h3>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Order ID: <span className="font-mono font-semibold">{orderData.orderId}</span></p>
                <p className="text-sm text-muted-foreground">We've received your order and will process it soon.</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Order details:</p>
                <div className="text-left bg-white p-3 rounded border">
                  <p className="font-medium">{orderData.productName}</p>
                  <p className="text-sm text-muted-foreground">₹{orderData.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {orderData.customerInfo.fullName} - {orderData.customerInfo.phoneNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {orderData.customerInfo.shippingAddress}, {orderData.customerInfo.city} - {orderData.customerInfo.pincode}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={() => {
                  setOrderSubmitted(false);
                  setOrderData(null);
                  setFormData({
                    fullName: "",
                    email: "",
                    phoneNumber: "",
                    shippingAddress: "",
                    city: "",
                    pincode: "",
                    paymentMethod: "upi",
                    paymentScreenshot: null,
                  });
                }}
              >
                Create New Order
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
          
          <div className="bg-muted/30 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{productName}</h3>
              <span className="font-bold">₹{price}</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number *</label>
            <Input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Shipping Address *</label>
          <Input
            type="text"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City *</label>
            <Input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">PIN Code *</label>
            <Input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Payment Information */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-4">Payment Information</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Payment Method *</label>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={formData.paymentMethod === "upi"}
                  onChange={handleChange}
                  className="text-primary"
                />
                <span className="text-sm font-medium">UPI Payment</span>
              </label>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-3 text-center">Payment Details</h4>
            <div className="text-center space-y-3">
              <div className="bg-white rounded-lg p-3 border-2 border-dashed border-blue-300">
                <p className="text-sm text-gray-600 mb-1">UPI ID</p>
                <p className="text-lg font-bold text-blue-600 break-all">theairnexpro@okicici</p>
              </div>
              <div className="text-sm text-gray-700">
                <p>Amount to pay: <span className="font-bold text-lg">₹{price}</span></p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                <div className="bg-blue-100 rounded p-2 text-center">
                  <span className="text-lg">💰</span>
                  <p className="text-xs font-medium">Google Pay</p>
                </div>
                <div className="bg-purple-100 rounded p-2 text-center">
                  <span className="text-lg">🔵</span>
                  <p className="text-xs font-medium">PhonePe</p>
                </div>
                <div className="bg-cyan-100 rounded p-2 text-center">
                  <span className="text-lg">💸</span>
                  <p className="text-xs font-medium">Paytm</p>
                </div>
                <div className="bg-orange-100 rounded p-2 text-center">
                  <span className="text-lg">🟠</span>
                  <p className="text-xs font-medium">Amazon Pay</p>
                </div>
                <div className="bg-green-100 rounded p-2 text-center">
                  <span className="text-lg">🇮🇳</span>
                  <p className="text-xs font-medium">BHIM UPI</p>
                </div>
                <div className="bg-gray-100 rounded p-2 text-center">
                  <span className="text-lg">📱</span>
                  <p className="text-xs font-medium">Others</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">Use any UPI app to pay with the UPI ID above</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Payment Screenshot *</label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="payment-screenshot"
              />
              <label htmlFor="payment-screenshot" className="cursor-pointer block text-center">
                {formData.paymentScreenshot ? (
                  <div className="space-y-2">
                    <div className="text-sm text-green-600 font-medium">
                      ✓ {formData.paymentScreenshot.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Click to change file
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-muted-foreground">
                      📸 Upload Payment Screenshot
                    </div>
                    <div className="text-xs text-muted-foreground">
                      JPG, PNG or PDF (Max 5MB)
                    </div>
                  </div>
                )}
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Please upload a screenshot of your payment confirmation
            </p>
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing Order..." : "Submit Order"}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          📧 You'll receive order confirmation via email
        </p>
      </form>
        </>
      )}
    </div>
  );
};

export default CheckoutForm;
