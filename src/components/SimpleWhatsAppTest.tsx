import { useState } from "react";
import { Button } from "./ui/button";

export const SimpleWhatsAppTest = () => {
  const [result, setResult] = useState("");

  const testDirectWhatsApp = () => {
    const phoneNumber = "918434903291"; // Your number
    const message = "🛒 NEW ORDER RECEIVED 🛒\n\n📋 Order ID: TEST123\n👤 Name: Test Customer\n📞 Phone: +91 98765 43210\n\n🚀 Please verify & process the order!";
    
    // Create WhatsApp URL directly
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    console.log("🔍 Direct test - Phone number:", phoneNumber);
    console.log("🔍 Direct test - Message:", message);
    console.log("🔍 Direct test - WhatsApp URL:", whatsappUrl);
    
    // Try to open WhatsApp
    const newWindow = window.open(whatsappUrl, '_blank');
    
    if (newWindow) {
      setResult("✅ WhatsApp opened successfully! Check if you received the message.");
      console.log("✅ WhatsApp window opened");
    } else {
      setResult("❌ WhatsApp blocked. Copying message to clipboard...");
      console.log("❌ WhatsApp blocked");
      
      // Copy to clipboard
      navigator.clipboard.writeText(message).then(() => {
        setResult("📋 Message copied to clipboard! Please open WhatsApp manually and paste.");
        console.log("✅ Message copied to clipboard");
      }).catch(err => {
        setResult("❌ Clipboard failed. Check console for message.");
        console.error("❌ Clipboard error:", err);
      });
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
      <h3 className="font-semibold text-red-800 mb-3">🚨 Simple WhatsApp Test</h3>
      
      <div className="space-y-3">
        <p className="text-sm text-red-700">
          This test bypasses all services and tests WhatsApp directly:
        </p>
        
        <Button
          onClick={testDirectWhatsApp}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          🚀 Test WhatsApp Directly
        </Button>
        
        {result && (
          <div className="p-3 bg-white rounded border border-red-300">
            <p className="text-sm">{result}</p>
          </div>
        )}
        
        <div className="text-xs text-red-600 bg-red-100 rounded p-2">
          <strong>Expected result:</strong><br/>
          • WhatsApp should open with your number +91 84349 03291<br/>
          • Message should appear in WhatsApp<br/>
          • If blocked, message will be copied to clipboard
        </div>
      </div>
    </div>
  );
};
