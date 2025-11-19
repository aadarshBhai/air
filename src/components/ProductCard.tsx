import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/data/products";
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
  const navigate = useNavigate();
  const discount = props.originalPrice ? Math.round(((props.originalPrice - props.price) / props.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    addToCart(props as Product);
    toast.success("Added to cart!", {
      description: `${props.name} has been added to your cart.`
    });
  };

  const handleBuyNow = () => {
    navigate(`/product/${props.id}`);
  };

  return (
    <Card className="group overflow-hidden border-border bg-card shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/product/${props.id}`}>
        <div className="overflow-hidden bg-muted/20 aspect-square sm:aspect-[4/3] lg:aspect-square">
          <img
            src={props.image}
            alt={props.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardContent className="p-5">
        <h3 className="font-black text-xl mb-3 group-hover:text-primary transition-colors">{props.name}</h3>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-foreground">₹{props.price}</span>
            {props.originalPrice && props.originalPrice > props.price && (
              <>
                <span className="text-lg text-muted-foreground line-through font-bold">₹{props.originalPrice}</span>
                <span className="text-sm font-black text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex gap-3">
        <Button
          variant="outline"
          className="flex-1 h-12 sm:h-14 text-base sm:text-lg font-bold border-2 hover:bg-accent hover:text-accent-foreground transition-all duration-200"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Button
          variant="cta"
          className="flex-1 h-12 sm:h-14 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
