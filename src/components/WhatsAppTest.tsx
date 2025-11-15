import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { MessageCircle, TestTube } from "lucide-react";
import { WhatsAppService } from "../utils/whatsappService";

export const WhatsAppTest = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("918434903291");

  const testWhatsApp = async () => {
    setIsTesting(true);

    try {
      // Create test order data
      const testOrderData = {
        orderId: "TEST" + Date.now(),
        productName: "Test Product",
        price: 999,
        customerInfo: {
          fullName: "Test Customer",
          email: "test@example.com",
          phoneNumber: "+91 98765 43210",
          shippingAddress: "123 Test Street",
          city: "Mumbai",
          pincode: "400001"
        },
        paymentMethod: "UPI",
        paymentScreenshot: null
      };

      console.log('🧪 Starting WhatsApp test...');
      console.log('🧪 Test order data:', testOrderData);
      
      // Debug: Check WhatsApp number
      WhatsAppService.debugNumber();
      
      await WhatsAppService.sendOrderToWhatsApp(testOrderData);
      
      toast.success("Test message sent to WhatsApp! Check your browser console for details.");
    } catch (error) {
      toast.error("Test failed: " + error.message);
      console.error('WhatsApp test error:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const updatePhoneNumber = () => {
    // This would update the service in a real app
    // For now, just show what needs to be done
    alert(`To update WhatsApp number to ${phoneNumber}:\n\n1. Edit src/utils/whatsappService.ts\n2. Change line 20: private static readonly WHATSAPP_NUMBER = "${phoneNumber}"\n3. Save and restart the app\n\nCurrent number: 919876543210`);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 m-4">
      <div className="flex items-center gap-3 mb-3">
        <TestTube className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-blue-800">WhatsApp Integration Test</h3>
      </div>
      
      <div className="space-y-3">
        <p className="text-sm text-blue-700">
          Test if WhatsApp integration is working properly:
        </p>
        
        <div className="space-y-2">
          <label className="text-xs font-medium text-blue-800">WhatsApp Number:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="919876543210"
              className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={updatePhoneNumber}
              variant="outline"
              size="sm"
            >
              Update
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={testWhatsApp}
            disabled={isTesting}
            variant="outline"
            size="sm"
          >
            {isTesting ? (
              <>
                <MessageCircle className="mr-2 h-4 w-4 animate-pulse" />
                Testing...
              </>
            ) : (
              <>
                <TestTube className="mr-2 h-4 w-4" />
                Send Test Message
              </>
            )}
          </Button>
        </div>
        
        <div className="text-xs text-blue-600 bg-blue-100 rounded p-2">
          <strong>Debug Steps:</strong><br/>
          1. Click "Send Test Message"<br/>
          2. Check browser console (F12 → Console)<br/>
          3. Look for 🚀, 📱, 📞, 🪟 emojis<br/>
          4. Verify WhatsApp opens or shows alternatives
        </div>
      </div>
    </div>
  );
};
