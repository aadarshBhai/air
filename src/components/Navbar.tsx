import { Link } from "react-router-dom";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import CartDropdown from "@/components/CartDropdown";
import logo from "/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/90 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="AirNex Logo" 
              className="h-10 w-auto" 
              style={{ height: '40px', width: 'auto' }}
            />
            <span className="font-logo text-3xl font-black text-primary tracking-tight">AirNex</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-bold text-foreground hover:text-primary transition-colors duration-200">
              Home
            </Link>
            <Link to="/shop" className="font-bold text-foreground hover:text-primary transition-colors duration-200">
              Shop
            </Link>
            <Link to="/about" className="font-bold text-foreground hover:text-primary transition-colors duration-200">
              About
            </Link>
            <Link to="/contact" className="font-bold text-foreground hover:text-primary transition-colors duration-200">
              Contact
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-8">
                  <Link 
                    to="/" 
                    className="text-lg font-bold text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/shop" 
                    className="text-lg font-bold text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Shop
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-lg font-bold text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    to="/contact" 
                    className="text-lg font-bold text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Cart Dropdown - Always Visible */}
          <CartDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
