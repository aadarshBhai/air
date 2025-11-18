import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/data/products";
import { toast } from "sonner";
import { Copy, Smartphone, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
// QR code from public folder
const upiQR = "/qr.jpg";
import { upiApps } from "@/assets/upi-logos";

interface BuyNowModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const BuyNowModal = ({ product, isOpen, onClose }: BuyNowModalProps) => {
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [showCopyUPI, setShowCopyUPI] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // UPI payment details
  const upiId = "9065588337@upi"; // Your UPI ID
  
  // Calculate half payment amounts
  const halfPaymentAmount = product ? Math.ceil(product.price / 2) : 0;
  const remainingAmount = product ? product.price - halfPaymentAmount : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    setStep("payment");
  };

  const handlePaymentDone = async () => {
    try {
      // Generate order ID
      const orderId = `ORD${Date.now()}`;
      
      // Save order to backend without screenshot
      const orderData = {
        orderId,
        productName: product.name,
        price: product.price,
        advancePaid: halfPaymentAmount,
        remainingAmount: remainingAmount,
        paymentType: "50% advance",
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phone,
          shippingAddress: formData.address,
          city: formData.city,
          pincode: formData.pincode,
        },
        paymentMethod: "upi",
        paymentScreenshot: null, // No screenshot required
      };

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        });

        if (response.ok) {
          const savedOrder = await response.json();
          setStep("success");
          toast.success(`Order placed successfully! Order ID: ${orderId}`, {
            duration: 5000
          });
        } else {
          const error = await response.json();
          toast.error("Failed to save order", {
            description: error.error || "Please try again."
          });
        }
      } catch (error) {
        toast.error("Failed to save order", {
          description: "Please check your connection and try again."
        });
      }
    } catch (error) {
      toast.error("Failed to process order");
      console.error("Order processing error:", error);
    }
  };

  // Generate UPI link function
  const generateUpiLink = (productName: string, amount: number) => {
    return `upi://pay?pa=9065588337@upi&pn=Ayush Store&am=${amount}&cu=INR&tn=${encodeURIComponent(productName)}`;
  };

  const handleUpiAppClick = async (appName: string) => {
    try {
      // Extract product details
      const price = halfPaymentAmount; // Use half payment amount
      const productName = product.name;
      
      // Generate UPI link using exact required format
      const upiLink = `upi://pay?pa=9065588337@upi&pn=Ayush Store&am=${price}&cu=INR&tn=${encodeURIComponent(productName)}`;
      
      // Console logs for debugging
      console.log('Final UPI Link:', upiLink);
      console.log('Product Name:', productName);
      console.log('Half Payment Amount:', price);
      console.log('Remaining Amount:', remainingAmount);
      console.log('Encoded Product Name:', encodeURIComponent(productName));
      
      // Device detection
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      console.log('Device detection:', { isMobile, userAgent });
      
      if (isMobile) {
        // Mobile: Open UPI link directly
        window.location.href = upiLink;
        
        // Show success message
        toast.success(`Opening UPI app... Pay ₹${price}`, {
          duration: 5000
        });
      } else {
        // Desktop: Show QR or copy UPI ID message
        toast.info("Scan QR code or copy UPI ID to make payment", {
          description: "UPI apps work on mobile devices only",
          duration: 6000
        });
      }
      
    } catch (error) {
      console.error('Error in UPI app click:', error);
      toast.error("Failed to process UPI payment");
    }
  };

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      toast.success("UPI ID copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy UPI ID");
    }
  };

  const handleClose = () => {
    setStep("form");
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
    });
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Shipping Details</DialogTitle>
              <DialogDescription>
                Please provide your shipping information to complete the order for {product.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-2xl font-black text-primary mt-2">₹{product.price}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Shipping Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleProceedToPayment} className="w-full" size="lg" variant="cta">
                Proceed to Payment
              </Button>
            </div>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Complete Payment</DialogTitle>
              <DialogDescription>
                Pay ₹{halfPaymentAmount} now for {product.name} (50% advance)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Payment Breakdown */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-black text-blue-800 mb-3 text-center">Payment Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Price:</span>
                    <span className="font-black">₹{product.price}</span>
                  </div>
                  <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                    <span className="text-sm font-bold text-green-800">Pay Now (50%):</span>
                    <span className="font-bold text-green-700 text-lg">₹{halfPaymentAmount}</span>
                  </div>
                  <div className="flex justify-between items-center bg-orange-50 p-2 rounded">
                    <span className="text-sm font-bold text-orange-800">Pay on Delivery:</span>
                    <span className="font-bold text-orange-700 text-lg">₹{remainingAmount}</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-3 text-center">
                  💰 Remaining amount will be collected at the time of delivery
                </p>
              </div>
              {/* UPI ID Display */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Smartphone className="w-8 h-8 text-blue-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-800">Pay via UPI</h3>
                </div>
                <div className="bg-white rounded-lg p-3 mb-4 border-2 border-dashed border-blue-300">
                  <p className="text-sm text-gray-600 mb-1">UPI ID</p>
                  <p className="text-lg font-bold text-blue-600 break-all">{upiId}</p>
                  <Button 
                    onClick={copyUpiId} 
                    variant="outline" 
                    size="sm"
                    className="w-full mt-2"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy UPI ID
                  </Button>
                </div>
                <p className="text-sm text-gray-600">Amount to pay: <span className="font-bold text-lg">₹{product.price}</span></p>
              </div>

              {/* UPI Apps Grid */}
              <div>
                <h4 className="text-lg font-black mb-4 text-center">Choose Your UPI App</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {upiApps.map((app) => (
                    <Button
                      key={app.name}
                      variant="outline"
                      className="h-16 flex flex-col items-center justify-center hover:scale-105 transition-transform"
                      onClick={() => handleUpiAppClick(app.name)}
                    >
                      <img 
                        src={app.logo} 
                        alt={app.name}
                        className="w-6 h-6 mb-1 object-contain"
                      />
                      <span className="text-xs font-bold">{app.name}</span>
                    </Button>
                  ))}
                </div>

                {/* Manual Payment Instructions */}
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 font-bold mb-2">
                    ⚠️ If UPI apps don't open automatically:
                  </p>
                  <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
                    <li>Copy UPI ID: <span className="font-mono bg-amber-100 px-2 py-1 rounded">{upiId}</span></li>
                    <li>Open your UPI app manually</li>
                    <li>Send ₹{halfPaymentAmount} to <span className="font-mono">{upiId}</span></li>
                    <li>Click "Complete Order" after payment</li>
                  </ol>
                </div>

                {/* Copy UPI ID Button */}
                <Button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(upiId);
                      toast.success(`UPI ID copied: ${upiId}`, { duration: 4000 });
                    } catch (error) {
                      console.error('Failed to copy UPI ID:', error);
                      toast.error("Failed to copy UPI ID");
                    }
                  }}
                  className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  📋 Copy UPI ID: {upiId}
                </Button>
              </div>

              {/* QR Code as backup */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 text-center mb-3">Or scan QR code if UPI apps don't open</p>
                <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center border-2 border-gray-300 p-2">
                  <img 
                    src={upiQR} 
                    alt="UPI QR Code for Payment" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h4 className="font-black text-blue-800 mb-2 text-center">How to Pay:</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Click any UPI app button above</li>
                  <li>2. <strong>Mobile:</strong> App opens automatically | <strong>Desktop:</strong> UPI ID copied</li>
                  <li>3. Pay amount: ₹{halfPaymentAmount} (50% advance)</li>
                  <li>4. Complete payment and click "Complete Order"</li>
                </ol>
                <p className="text-xs text-blue-600 mt-2 text-center">
                  📱 Mobile users: Apps will open automatically
                  <br />
                  💻 Desktop users: Copy UPI ID and paste in your app
                </p>
              </div>

              <Button onClick={handlePaymentDone} className="w-full" size="lg" variant="cta">
                Complete Order →
              </Button>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Order Confirmed!</DialogTitle>
              <DialogDescription>
                Your order has been placed successfully. We'll send you a confirmation message shortly.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-8 text-center">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-accent" />
              </div>
              <div>
                <p className="text-lg font-black">Your order has been received!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  We'll verify your payment and process your order soon.
                </p>
                <p className="text-sm text-muted-foreground">
                  You'll receive a confirmation email at <span className="font-bold">{formData.email}</span>
                </p>
              </div>
              <Button onClick={handleClose} className="w-full" size="lg" variant="cta">
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BuyNowModal;
