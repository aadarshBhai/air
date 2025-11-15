import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Eye, Heart, Award, Instagram, Facebook, MessageCircle } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About AirNex</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Making clean air accessible to everyone through innovation and affordability
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              AirNex was founded by a young entrepreneur with a vision to make clean air accessible
              to everyone. Witnessing the severe impact of air pollution on India's urban
              population, we recognized the urgent need for affordable, high-quality pollution
              protection solutions.
            </p>
            <p>
              We believe that innovation and affordability can coexist. By directly importing
              premium products from manufacturers and eliminating middlemen, we're able to offer
              top-tier pollution protection at prices that don't compromise your budget.
            </p>
            <p>
              Today, AirNex proudly serves over 10,000 customers across India, helping families
              breathe cleaner air and live healthier lives. Our commitment remains unwavering: to
              provide products that genuinely protect, at prices that genuinely work for you.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To provide affordable, high-quality, and eco-friendly air protection solutions for
                everyone. We're committed to making pollution protection accessible to all Indians,
                regardless of their economic background.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To become India's most trusted brand for pollution protection products. We envision
                a future where every Indian family has access to clean air and effective protection
                against environmental pollutants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
          <p className="text-muted-foreground text-lg">The principles that guide everything we do</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-semibold text-xl">Sustainability</h3>
            <p className="text-sm text-muted-foreground">
              Committed to eco-friendly practices and sustainable product development
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-semibold text-xl">Innovation</h3>
            <p className="text-sm text-muted-foreground">
              Constantly improving our products with the latest filtration technology
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Target className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-semibold text-xl">Trust</h3>
            <p className="text-sm text-muted-foreground">
              Building lasting relationships through transparency and quality
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-semibold text-xl">Customer First</h3>
            <p className="text-sm text-muted-foreground">
              Your health and satisfaction are our top priorities
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the AirNex Family</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Experience the difference of premium pollution protection at affordable prices
          </p>
          <Button asChild size="lg">
            <Link to="/shop">Shop Now</Link>
          </Button>
          <div className="mt-8">
            <p className="text-sm text-muted-foreground mb-4">Follow us on social media</p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://instagram.com/airnex"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/airnex"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
