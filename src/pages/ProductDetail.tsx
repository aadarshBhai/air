import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductContext";
import { Product } from "@/data/products";
import ReviewCard from "@/components/ReviewCard";
import BuyNowModal from "@/components/BuyNowModal";
import { toast } from "sonner";

// Extend the Product type to include _id
interface ProductWithId extends Product {
  _id?: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductWithId | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const navigate = useNavigate();

  // ✅ Image base and processing
  const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const placeholderImage = `${import.meta.env.BASE_URL}placeholder-product.png`;

  const processImageUrl = (url?: string): string => {
    if (!url) return placeholderImage;
    const trimmedUrl = url.trim();
    if (!trimmedUrl || trimmedUrl.toLowerCase() === "null") return placeholderImage;
    if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) return trimmedUrl;
    if (trimmedUrl.startsWith("/uploads/")) return `${apiBase}${trimmedUrl}`;
    if (trimmedUrl.startsWith("uploads/")) return `${apiBase}/${trimmedUrl}`;
    return placeholderImage;
  };

  useEffect(() => {
    if (!id) {
      console.error("No product ID provided");
      toast.error("Invalid product");
      navigate("/shop");
      return;
    }

    if (productsLoading) return;

    if (productsError) {
      console.error("Error loading products:", productsError);
      toast.error("Failed to load products");
      return;
    }

    if (products.length > 0) {
      let foundProduct = products.find((p) => {
        const prod = p as ProductWithId;
        const possibleIds = [prod.id?.toString(), prod._id?.toString(), prod.id, prod._id].filter(Boolean);
        return possibleIds.includes(id?.toString());
      });

      if (!foundProduct) {
        const idNum = Number(id);
        if (!isNaN(idNum)) {
          foundProduct =
            products.find((p) => Number((p as any).id) === idNum || Number((p as any)._id) === idNum) ||
            products[idNum - 1];
        }
      }

      if (foundProduct) {
        const productWithDefaults: ProductWithId = {
          id: foundProduct.id || (foundProduct as any)._id,
          name: foundProduct.name || "Untitled Product",
          description: foundProduct.description || "",
          fullDescription: foundProduct.fullDescription || foundProduct.description || "",
          price: foundProduct.price || 0,
          originalPrice: foundProduct.originalPrice,
          discountPercentage: foundProduct.discountPercentage,
          images: foundProduct.images || [],
          category: foundProduct.category || "uncategorized",
          rating: foundProduct.rating || 0,
          features: foundProduct.features || [],
          inStock: foundProduct.inStock !== undefined ? foundProduct.inStock : true,
          createdAt: foundProduct.createdAt || new Date().toISOString(),
          updatedAt: foundProduct.updatedAt || new Date().toISOString(),
          _id: (foundProduct as any)._id,
        };
        setProduct(productWithDefaults);
        setIsLoading(false);
      } else {
        console.error("Product not found:", id);
        toast.error("Product not found");
        navigate("/shop");
      }
    } else {
      console.error("No products available");
      toast.error("No products available");
      navigate("/shop");
    }
  }, [products, productsLoading, productsError, id, navigate]);

  if (productsLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (productsError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{productsError || "Product not found"}</h1>
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
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    setShowBuyModal(true);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const mainImage = processImageUrl(product.images?.[0]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>{" "}
          / <Link to="/shop" className="hover:text-primary">Shop</Link> /{" "}
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="bg-muted/20 rounded-2xl overflow-hidden">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = placeholderImage;
                e.currentTarget.onerror = null;
              }}
            />
            {/* Debug Info */}
            <div className="mt-2 p-2 bg-gray-100 text-xs text-gray-600">
              <p>Processed Image URL: {mainImage}</p>
              <p>Original Image URL: {product.images?.[0] || "No image"}</p>
              <p>Images array length: {product.images?.length || 0}</p>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full mb-4">
                {product.category}
              </div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < product.rating ? "fill-accent text-accent" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">({product.rating}.0)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-primary">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
                  <span className="text-lg font-semibold text-accent bg-accent/10 px-3 py-1 rounded">{discount}% OFF</span>
                </>
              )}
            </div>

            <p className="text-muted-foreground text-lg">{product.fullDescription}</p>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Key Features:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleAddToCart} variant="outline" size="lg" className="flex-1">
                Add to Cart
              </Button>
              <Button onClick={handleBuyNow} variant="cta" size="lg" className="flex-1">
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

        {/* Reviews Section */}
        <div className="border-t border-border pt-12">
          <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReviewCard name="Amit Kumar" rating={5} comment="Excellent product! Works exactly as described. Very happy with my purchase." />
            <ReviewCard name="Sneha Reddy" rating={5} comment="Great quality and fast delivery. Would definitely recommend AirNex to everyone." />
            <ReviewCard name="Vikram Singh" rating={4} comment="Good product overall. Comfortable to wear and effective protection." />
          </div>
        </div>
      </div>

      <BuyNowModal product={product} isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} />
    </div>
  );
};

export default ProductDetail;
