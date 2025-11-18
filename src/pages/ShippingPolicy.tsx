import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Truck, Clock, MapPin, Package } from "lucide-react";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-black mb-4">Shipping Policy</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Fast and reliable delivery across India. Track your order every step of the way 
            from our warehouse to your doorstep.
          </p>
        </div>
      </section>

      {/* Shipping Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Delivery Areas */}
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black">Delivery Areas</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We ship to all major cities and towns across India. Our delivery network covers 
                over 20,000 pin codes nationwide.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-black text-foreground mb-2">Metro Cities</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Delhi NCR</li>
                    <li>• Mumbai</li>
                    <li>• Bangalore</li>
                    <li>• Chennai</li>
                    <li>• Kolkata</li>
                    <li>• Hyderabad</li>
                  </ul>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-black text-foreground mb-2">Other Major Cities</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Pune</li>
                    <li>• Ahmedabad</li>
                    <li>• Jaipur</li>
                    <li>• Lucknow</li>
                    <li>• Chandigarh</li>
                    <li>• And many more...</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black">Delivery Time</h2>
            </div>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-black">Standard Delivery</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <span>Metro Cities</span>
                      <span className="font-black">2-3 days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <span>Other Cities</span>
                      <span className="font-black">4-6 days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <span>Remote Areas</span>
                      <span className="font-black">7-10 days</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-black">Express Delivery</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex justify-between items-center p-3 bg-primary/10 border border-primary/20 rounded">
                      <span>Major Cities</span>
                      <span className="font-black text-primary">1-2 days</span>
                    </div>
                    <p className="text-sm">Additional charges apply</p>
                    <p className="text-sm">Available for select pin codes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Charges */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-black mb-6">Shipping Charges</h2>
            <div className="space-y-4 text-muted-foreground">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-black text-foreground">Standard Shipping</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <span>Orders below ₹499</span>
                      <span className="font-black">₹49</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded">
                      <span>Orders above ₹499</span>
                      <span className="font-black text-green-600">FREE</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-black text-foreground">Express Shipping</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-primary/10 border border-primary/20 rounded">
                      <span>All orders</span>
                      <span className="font-black text-primary">₹99</span>
                    </div>
                    <p className="text-sm">Delivery within 1-2 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Tracking */}
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black">Order Tracking</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Track your order in real-time from dispatch to delivery. You'll receive regular 
                updates via SMS and email.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-black text-foreground mb-3">Tracking Process:</h3>
                <ol className="space-y-2">
                  <li>1. Order confirmed and processed</li>
                  <li>2. Package dispatched from warehouse</li>
                  <li>3. In-transit updates provided</li>
                  <li>4. Out for delivery notification</li>
                  <li>5. Delivered successfully</li>
                </ol>
              </div>
            </div>
          </div>

          {/* International Shipping */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-black mb-6">International Shipping</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Currently, we only ship within India. We're working on expanding our delivery 
                network to international destinations soon.
              </p>
              <p className="text-sm">
                For international orders inquiries, please contact our support team at 
                support@airnex.com
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-black mb-4">Shipping Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Need help with delivery or have special shipping requirements? 
              Our team is here to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="tel:+919876543210">Call Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingPolicy;
