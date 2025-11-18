import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckoutForm } from "@/components/CheckoutForm";
import { WhatsAppTest } from "@/components/WhatsAppTest";
import { SimpleWhatsAppTest } from "@/components/SimpleWhatsAppTest";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();

  // Calculate total
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // If cart is empty, show empty cart message
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-black mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some products to your cart before checking out
            </p>
            <Button asChild>
              <Link to="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-black text-center mb-8">Complete Your Purchase</h1>
        
        {/* WhatsApp Test Component - Remove in production */}
        <WhatsAppTest />
        
        {/* Simple WhatsApp Test - Direct test */}
        <SimpleWhatsAppTest />
        
        <div className="max-w-4xl mx-auto">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-black mb-4">Order Summary</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b">
                    <div className="flex-1">
                      <div className="font-bold">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × ₹{item.price}
                      </div>
                    </div>
                    <div className="font-bold">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 font-black text-lg">
                  <span>Total ({itemCount} items)</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <CheckoutForm 
                productName={`${itemCount} item${itemCount > 1 ? 's' : ''}`}
                price={total}
              />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-bold mb-2">📞 Need help with your order?</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Contact us at <a href="tel:+919876543210" className="text-primary hover:underline">+91 98765 43210</a>
            </p>
            <p className="text-sm text-muted-foreground">
              Or WhatsApp us at <a href="https://wa.me/919876543210" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">+91 98765 43210</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
