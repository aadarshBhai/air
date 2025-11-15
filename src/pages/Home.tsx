import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Wind, Award, Heart, Truck, Users } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import ProductSearch from "@/components/ProductSearch";
import ReviewCard from "@/components/ReviewCard";
import { useProducts } from "@/contexts/ProductContext";

const Home = () => {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-12 md:py-20">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-background/20 to-background/30"></div>
          <img 
            src="/background.png"
            alt="Clean air and blue sky background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center relative">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              Breathe Smart.
              <br />
              <span className="text-black">Live Better.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              AirNex brings you cutting-edge anti-pollution masks designed for India's urban environments. 
              Breathe clean air wherever you go with our premium filtration technology.
            </p>
            <div className="flex gap-4">
              <Button asChild variant="cta" size="lg">
                <Link to="/shop">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-secondary">The Problem</h2>
              <p className="text-muted-foreground">
                Air pollution in India has reached critical levels, affecting millions of lives daily.
                PM2.5 particles, harmful gases, and pollutants pose serious health risks.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span className="text-sm">AQI levels frequently exceed safe limits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span className="text-sm">Urban areas most affected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span className="text-sm">Long-term health consequences</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">Our Solution</h2>
              <p className="text-muted-foreground">
                AirNex masks provide advanced protection with multi-layer filtration technology.
                Designed for comfort, style, and maximum effectiveness against pollutants.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">N95+ grade filtration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Comfortable all-day wear</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Stylish designs for every lifestyle</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Find Your Perfect Protection</h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8">
              Search through our complete collection of anti-pollution products
            </p>
            <ProductSearch
              placeholder="Search for masks, purifiers, or any product..."
              className="max-w-2xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative bg-muted/20 py-16 md:py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <ProductGrid
            products={featuredProducts}
            title="Featured Products"
            subtitle="Discover our premium range of pollution protection solutions"
            itemsPerPage={4}
          />
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 py-16 md:py-20">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose AirNex?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-base md:text-lg">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">Medical-grade filtration technology</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Wind className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-base md:text-lg">Breathable Design</h3>
              <p className="text-sm text-muted-foreground">Comfortable for extended wear</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-base md:text-lg">Certified Safe</h3>
              <p className="text-sm text-muted-foreground">Meets international standards</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-base md:text-lg">Health First</h3>
              <p className="text-sm text-muted-foreground">Your wellbeing is our priority</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="relative bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Real experiences from real customers who trust AirNex for their daily protection needs
            </p>
          </div>
          
          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            <ReviewCard
              name="Priya Sharma"
              rating={5}
              comment="The N95 mask is incredibly comfortable and I can breathe easily even during long commutes. Highly recommended!"
            />
            <ReviewCard
              name="Rahul Verma"
              rating={5}
              comment="Excellent quality and fits perfectly. The air filtration really works, I can feel the difference in polluted areas."
            />
            <ReviewCard
              name="Anjali Patel"
              rating={5}
              comment="Stylish design and effective protection. Finally a mask that doesn't compromise on looks or safety!"
            />
            <ReviewCard
              name="Amit Kumar"
              rating={4}
              comment="Great product quality and fast delivery. The smart air purifier has made a huge difference in my home air quality."
            />
            <ReviewCard
              name="Sneha Reddy"
              rating={5}
              comment="Love the kids' masks! They're colorful, comfortable, and my children actually enjoy wearing them. Perfect for school."
            />
            <ReviewCard
              name="Vikram Singh"
              rating={5}
              comment="The car air purifier is amazing! I can immediately smell the difference when I enter my car. Worth every penny."
            />
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4.8/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Customer Support</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Share Your Experience</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
