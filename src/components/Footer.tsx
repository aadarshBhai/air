import { Link } from "react-router-dom";
import { Instagram, Facebook, MessageCircle, Phone, Mail } from "lucide-react";
import logo from '/logo.png';
import qrCode from '/qr.jpg';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={logo} 
                alt="AirNex Logo" 
                className="h-10 w-auto"
                style={{ height: '40px', width: 'auto' }}
              />
              <h3 className="font-logo text-xl font-semibold text-primary">AirNex</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Premium anti-pollution products designed for a cleaner tomorrow.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/airnexpro?igsh=MTdxeGxtbmM3bm4yZw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Shop
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Policies</h4>
            <div className="flex flex-col gap-2">
              <Link to="/return-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Return Policy
              </Link>
              <Link to="/shipping-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Shipping Policy
              </Link>
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+919876543210" className="hover:text-primary transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:support@airnex.com" className="hover:text-primary transition-colors">
                  support@airnex.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4 text-primary" />
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  WhatsApp Support
                </a>
              </div>
              <p className="text-muted-foreground">Mon-Sat: 9 AM - 6 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 AirNex. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>We accept:</span>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-background border border-border rounded text-xs">Visa</span>
              <span className="px-2 py-1 bg-background border border-border rounded text-xs">UPI</span>
              <span className="px-2 py-1 bg-background border border-border rounded text-xs">Paytm</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
