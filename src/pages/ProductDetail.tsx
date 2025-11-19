import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import BuyNowModal from "@/components/BuyNowModal";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === id);

  const [showBuyModal, setShowBuyModal] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Added to cart!", {
      description: `${product.name} has been added to your cart.`
    });
  };

  const handleBuyNow = () => {
    setShowBuyModal(true);
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          {" / "}
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          {" / "}
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="bg-muted/20 rounded-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full mb-4">
                {product.category}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < product.rating ? "fill-accent text-accent" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">({product.rating}.0)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2 sm:gap-4">
              <span className="text-3xl sm:text-4xl font-black text-primary">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg sm:text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-sm sm:text-lg font-black text-red-600 bg-red-50 px-2 sm:px-3 py-1 rounded border border-red-200">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-muted-foreground text-lg">{product.fullDescription}</p>

            <div className="space-y-3">
              <h3 className="font-bold text-lg">Key Features:</h3>
              <ul className="space-y-2">
                {product.features ? product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                )) : (
                  <li className="text-muted-foreground">No features available</li>
                )}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                onClick={handleAddToCart} 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto flex-1 h-16 text-xl font-black border-2 border-primary text-primary bg-primary/10 rounded-full shadow-md"
              >
                Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow} 
                variant="cta"
                size="lg" 
                className="w-full sm:w-auto flex-1 h-16 text-xl font-black bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl hover:shadow-[0_15px_40px_rgba(37,99,235,0.6)] transform hover:scale-105 transition-all duration-200 rounded-full"
              >
                Buy Now
              </Button>
            </div>

            <div className="border-t border-border pt-6 space-y-2 text-sm text-muted-foreground">
              <p>✓ Free shipping on orders above ₹500</p>
              <p>✓ Easy 30-day returns</p>
              <p>✓ 100% authentic products</p>
            </div>
          </div>
        </div>

      </div>

      <BuyNowModal
        product={product}
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
      />
    </div>
  );
};

export default ProductDetail;
