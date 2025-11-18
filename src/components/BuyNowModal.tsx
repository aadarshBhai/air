import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/data/products";
import { toast } from "sonner";
import { Upload, Copy, Smartphone, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import upiQR from "@/assets/upi-qr_backup.jpg";
import { upiApps } from "@/assets/upi-logos";
import { FileUploadService } from "@/utils/fileUploadService";

interface BuyNowModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const BuyNowModal = ({ product, isOpen, onClose }: BuyNowModalProps) => {
  const [step, setStep] = useState<"form" | "payment" | "upload" | "success">("form");
  const [showCopyUPI, setShowCopyUPI] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);

  // UPI payment details
  const upiId = "9065588337ayush@ybl"; // Your UPI ID

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

  const handlePaymentDone = () => {
    setStep("upload");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  // Generate UPI link function
  const generateUpiLink = (productName: string, amount: number) => {
    return `upi://pay?pa=9065588337ayush@ybl&pn=Ayush Store&am=${amount}&cu=INR&tn=${encodeURIComponent(productName)}`;
  };

  const handleUpiAppClick = async (appName: string) => {
    try {
      // Extract product details
      const price = product.price;
      const productName = product.name;
      
      // Generate UPI link using exact required format
      const upiLink = `upi://pay?pa=9065588337ayush@ybl&pn=Ayush Store&am=${price}&cu=INR&tn=${encodeURIComponent(productName)}`;
      
      // Console logs for debugging
      console.log('Final UPI Link:', upiLink);
      console.log('Product Name:', productName);
      console.log('Amount:', price);
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

  const handleSubmitScreenshot = async () => {
    if (!screenshot) {
      toast.error("Please upload your payment screenshot");
      return;
    }

    try {
      // Generate order ID
      const orderId = `ORD${Date.now()}`;
      
      // Upload the screenshot to get a URL
      toast.loading("Uploading payment screenshot...");
      const screenshotUrl = await FileUploadService.uploadFileWithFallback(screenshot, orderId);
      toast.dismiss();
      toast.success("Payment screenshot uploaded successfully!");

      // Save order to backend
      const orderData = {
        orderId,
        productName: product.name,
        price: product.price,
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phone,
          shippingAddress: formData.address,
          city: formData.city,
          pincode: formData.pincode,
        },
        paymentMethod: "upi",
        paymentScreenshot: screenshotUrl,
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
          toast.success(`Order placed successfully! Order ID: ${orderId}`);
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
      toast.dismiss();
      toast.error("Failed to upload screenshot. Please try again.");
      console.error("Screenshot upload error:", error);
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
    setScreenshot(null);
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Shipping Details</DialogTitle>
              <DialogDescription>
                Please provide your shipping information to complete the order for {product.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-2xl font-bold text-primary mt-2">₹{product.price}</p>
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
              <DialogTitle className="text-2xl">Complete Payment</DialogTitle>
              <DialogDescription>
                Choose your preferred UPI app to pay ₹{product.price} for {product.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
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
                <h4 className="text-lg font-semibold mb-4 text-center">Choose Your UPI App</h4>
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
                      <span className="text-xs font-medium">{app.name}</span>
                    </Button>
                  ))}
                </div>

                {/* Manual Payment Instructions */}
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 font-medium mb-2">
                    ⚠️ If UPI apps don't open automatically:
                  </p>
                  <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
                    <li>Copy UPI ID: <span className="font-mono bg-amber-100 px-2 py-1 rounded">{upiId}</span></li>
                    <li>Open your UPI app manually</li>
                    <li>Send ₹{product.price} to <span className="font-mono">{upiId}</span></li>
                    <li>Upload payment screenshot below</li>
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
                <h4 className="font-semibold text-blue-800 mb-2 text-center">How to Pay:</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Click any UPI app button above</li>
                  <li>2. <strong>Mobile:</strong> App opens automatically | <strong>Desktop:</strong> UPI ID copied</li>
                  <li>3. Pay amount: ₹{product.price}</li>
                  <li>4. Complete payment and upload screenshot</li>
                </ol>
                <p className="text-xs text-blue-600 mt-2 text-center">
                  📱 Mobile users: Apps will open automatically
                  <br />
                  💻 Desktop users: Copy UPI ID and paste in your app
                </p>
              </div>

              <Button onClick={handlePaymentDone} className="w-full" size="lg" variant="cta">
                I've Completed Payment →
              </Button>
            </div>
          </>
        )}

        {step === "upload" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Upload Payment Screenshot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-accent/10 border border-accent/30 p-4 rounded-lg text-center">
                <CheckCircle className="w-12 h-12 text-accent mx-auto mb-2" />
                <p className="font-semibold text-lg">Thank You for Your Order!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please upload your payment screenshot to confirm your order 👇
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Note: Your order will be processed after verifying your uploaded image.
                </p>
              </div>

              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="max-w-xs mx-auto"
                />
                {screenshot && (
                  <p className="text-sm text-primary mt-2">
                    ✓ {screenshot.name}
                  </p>
                )}
              </div>

              <Button
                onClick={handleSubmitScreenshot}
                className="w-full"
                size="lg"
                variant="cta"
                disabled={!screenshot}
              >
                Submit Order
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
                <p className="text-lg font-semibold">Your order has been received!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  We'll verify your payment and process your order soon.
                </p>
                <p className="text-sm text-muted-foreground">
                  You'll receive a confirmation email at <span className="font-medium">{formData.email}</span>
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
