import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { MessageCircle, Upload, Check, Download } from "lucide-react";
import { WhatsAppService } from "../utils/whatsappService";

interface WhatsAppOrderSenderProps {
  orderData: {
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
  };
}

const WhatsAppOrderSender = ({ orderData }: WhatsAppOrderSenderProps) => {
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const downloadScreenshot = () => {
    if (orderData.paymentScreenshot) {
      const url = URL.createObjectURL(orderData.paymentScreenshot);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-screenshot-${orderData.orderId}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Payment screenshot downloaded!");
    }
  };

  const sendToWhatsApp = async () => {
    setIsSending(true);
    setIsUploading(true);

    try {
      // Use the WhatsAppService to send the order
      await WhatsAppService.sendOrderToWhatsApp(orderData);

      setIsSent(true);
      
      if (orderData.paymentScreenshot) {
        toast.success("Order sent to WhatsApp! Payment screenshot uploaded successfully.");
      } else {
        toast.success("Order details sent to WhatsApp! Please attach payment screenshot manually.");
      }
    } catch (error) {
      toast.error("Failed to send order to WhatsApp. Please try again.");
    } finally {
      setIsSending(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <MessageCircle className="h-6 w-6 text-green-600" />
        <h3 className="font-semibold text-green-800">Send Order to WhatsApp</h3>
      </div>
      
      <div className="space-y-4">
        <div className="text-sm text-green-700">
          <p className="mb-2">Send your order details directly to our WhatsApp:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Complete order information</li>
            <li>Customer shipping details</li>
            <li>Payment method and status</li>
            <li>Payment screenshot (if uploaded)</li>
          </ul>
        </div>

        {orderData.paymentScreenshot && (
          <div className="bg-white rounded p-3 border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Upload className="h-4 w-4 text-green-600" />
                <span className="font-medium">Payment Screenshot:</span>
                <span className="text-green-600">{orderData.paymentScreenshot.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadScreenshot}
                className="text-xs"
              >
                <Download className="mr-1 h-3 w-3" />
                Download
              </Button>
            </div>
          </div>
        )}

        <Button
          onClick={sendToWhatsApp}
          disabled={isSending || isSent}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          {isSent ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Sent to WhatsApp ✓
            </>
          ) : isUploading ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-bounce" />
              Uploading screenshot...
            </>
          ) : isSending ? (
            <>
              <MessageCircle className="mr-2 h-4 w-4 animate-pulse" />
              Sending to WhatsApp...
            </>
          ) : (
            <>
              <MessageCircle className="mr-2 h-4 w-4" />
              Send Order to WhatsApp
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          📱 This will open WhatsApp with your order details
        </p>
      </div>
    </div>
  );
};

export default WhatsAppOrderSender;
