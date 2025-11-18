import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from "lucide-react";

const ReturnPolicy = () => {
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
          <h1 className="text-4xl font-black mb-4">Return Policy</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Our hassle-free return policy ensures you can shop with confidence. 
            If you're not satisfied with your purchase, we're here to help.
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Return Period */}
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black">Return Period</h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>
                You can return products within <strong>7 days</strong> of delivery. 
                The product must be unused, in its original packaging, and in the same condition 
                that you received it.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-black text-foreground mb-2">Eligible Products:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>All masks (if unopened and sealed)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Air purifiers (within 7 days, unused)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Opened/used masks for hygiene reasons</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-black">Return Process</h2>
            </div>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-black">How to Initiate a Return:</h3>
                  <ol className="space-y-3 text-muted-foreground">
                    <li>1. Contact our customer support at support@airnex.com</li>
                    <li>2. Provide your order number and reason for return</li>
                    <li>3. Our team will review your request within 24 hours</li>
                    <li>4. Once approved, we'll arrange for pickup or provide return instructions</li>
                  </ol>
                </div>
                <div className="space-y-4">
                  <h3 className="font-black">Required Information:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Order number</li>
                    <li>• Product name/ID</li>
                    <li>• Reason for return</li>
                    <li>• Photos (if product is damaged)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Policy */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-black mb-6">Refund Policy</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Refunds are processed within <strong>5-7 business days</strong> after we receive 
                the returned product. The refund will be credited to your original payment method.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-black text-foreground mb-2">Refund Conditions:</h3>
                <ul className="space-y-2">
                  <li>• Product must pass quality inspection</li>
                  <li>• Original packaging must be intact</li>
                  <li>• All accessories and manuals included</li>
                  <li>• Shipping charges non-refundable</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Exceptions */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-black mb-6">Non-Returnable Items</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>The following items cannot be returned:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>Used or opened masks (hygiene reasons)</span>
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>Products damaged due to misuse</span>
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>Items returned after 7 days</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-black mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Our customer support team is here to assist you with any return-related queries.
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

export default ReturnPolicy;
