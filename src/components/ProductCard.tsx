import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/data/products";
import BuyNowModal from "./BuyNowModal";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  features: string[];
  fullDescription: string;
}

const ProductCard = (props: ProductCardProps) => {
  const { addToCart } = useCart();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const discount = props.originalPrice ? Math.round(((props.originalPrice - props.price) / props.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    addToCart(props as Product);
    toast.success("Added to cart!", {
      description: `${props.name} has been added to your cart.`
    });
  };

  const handleBuyNow = () => {
    setShowBuyModal(true);
  };

  return (
    <>
      <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-300">
        <Link to={`/product/${props.id}`}>
          <div className="overflow-hidden bg-muted/20" style={{ width: '2in', height: '2in', margin: '0 auto' }}>
            <img
              src={props.image}
              alt={props.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </Link>
        <CardContent className="p-4">
          <Link to={`/product/${props.id}`}>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
              {props.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{props.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">₹{props.price}</span>
            {props.originalPrice && (
              <>
                <span className="text-sm text-muted-foreground line-through">₹{props.originalPrice}</span>
                <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleAddToCart}>
            Add to Cart
          </Button>
          <Button variant="cta" className="flex-1" onClick={handleBuyNow}>
            Buy Now
          </Button>
        </CardFooter>
      </Card>

      <BuyNowModal
        product={props as Product}
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
      />
    </>
  );
};

export default ProductCard;
