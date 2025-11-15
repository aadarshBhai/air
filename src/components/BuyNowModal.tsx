import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/data/products";
import { toast } from "sonner";
import { Upload, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import upiQR from "@/assets/upi-qr.jpg";
import { FileUploadService } from "@/utils/fileUploadService";

interface BuyNowModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const BuyNowModal = ({ product, isOpen, onClose }: BuyNowModalProps) => {
  const [step, setStep] = useState<"form" | "payment" | "upload" | "success">("form");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);

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

      // Prepare WhatsApp message with all order details including screenshot URL
      const message = `🛍️ *New Order Received*

📦 *Product Details:*
Product: ${product.name}
Price: ₹${product.price}

👤 *Customer Details:*
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}

📍 *Shipping Address:*
Address: ${formData.address}
City: ${formData.city}
PIN Code: ${formData.pincode}

💳 *Payment:*
Status: Screenshot Uploaded
Amount: ₹${product.price}

📸 *Payment Screenshot:*
${screenshotUrl}

Note: Customer has uploaded payment screenshot for verification.`;

      // Encode message for URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappNumber = "918434903291"; // Updated to correct number
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");

      setStep("success");
      toast.success("Order details sent to WhatsApp!");
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
              <DialogTitle className="text-2xl">Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 text-center">
              <div className="bg-muted/30 p-6 rounded-lg">
                <div className="w-64 h-64 mx-auto bg-white rounded-lg flex items-center justify-center border-2 border-border p-3">
                  <img 
                    src={upiQR} 
                    alt="UPI QR Code for Payment" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="mt-4 text-lg font-semibold">Scan to Pay ₹{product.price}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Use any UPI app to scan and complete payment
                </p>
              </div>

              <Button onClick={handlePaymentDone} className="w-full" size="lg" variant="cta">
                I've Completed Payment
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
              <DialogTitle className="text-2xl text-center">Order Confirmed!</DialogTitle>
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
