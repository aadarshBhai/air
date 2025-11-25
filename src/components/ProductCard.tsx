import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import BuyNowModal from '@/components/BuyNowModal';
import { Product } from '@/data/products';

interface ProductCardProps extends Partial<Product> {
  className?: string;
  image?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name = 'Unnamed Product',
  description = 'No description available',
  price = 0,
  originalPrice = 0,
  images: propImages = [],
  image,
  features = [],
  rating = 0,
  className = '',
  inStock = true
}) => {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBuyOpen, setIsBuyOpen] = useState(false);

  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  const placeholderImage = `${import.meta.env.BASE_URL}placeholder-product.png`;

  const processImageUrl = (url?: string) => {
    if (!url) return placeholderImage;

    const trimmed = url.trim();

    if (trimmed.startsWith("http")) return trimmed;
    if (trimmed.startsWith("/uploads")) return `${apiBase}${trimmed}`;
    if (trimmed.startsWith("uploads")) return `${apiBase}/${trimmed}`;

    return `${apiBase}/uploads/${trimmed}`;
  };

  const processedImages = useMemo(() => {
    const unique = new Set<string>();

    propImages.forEach((i) => i && unique.add(processImageUrl(i)));
    if (image) unique.add(processImageUrl(image));

    if (unique.size === 0) unique.add(placeholderImage);

    return [...unique];
  }, [propImages, image]);

  const currentImage = processedImages[currentImageIndex];

  const handleImageError = () => {
    if (currentImageIndex < processedImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const handleAddToCart = (e: any) => {
    e.preventDefault();
    addToCart({
      id: id || `${Date.now()}`,
      name,
      price,
      images: processedImages,
      quantity: 1,
      inStock,
      description,
      originalPrice: originalPrice || price,
      features,
      rating,
      category: ''
    } as any);
    toast.success('Added to cart');
  };

  const hasDiscount = originalPrice > price;
  const discount = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Card className={`group overflow-hidden border bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col ${className}`}>
      <Link to={`/product/${id}`} className="block h-full flex flex-col">

        {/* FIXED IMAGE CONTAINER */}
        <div className="relative bg-gray-50 w-full aspect-square overflow-hidden">

          <img
            src={currentImage}
            alt={name}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />

          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discount}% OFF
            </div>
          )}

          {!inStock && (
            <div className="absolute top-2 right-2 bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
        </div>

        {/* THUMBNAILS */}
        {processedImages.length > 1 && (
          <div className="px-4 pt-3 pb-1 flex gap-2 overflow-x-auto">
            {processedImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex(idx);
                }}
                className={`h-12 w-12 rounded-md overflow-hidden border ${
                  idx === currentImageIndex ? "border-primary ring-2 ring-primary/30" : "border-gray-200"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
            {name}
          </h3>

          {/* PRICE */}
          <div className="flex items-center mt-auto">
            <span className="text-lg font-bold text-gray-900">${price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="ml-2 text-sm line-through text-gray-500">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* BUTTONS */}
          <div className="mt-4 flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault();
                setIsBuyOpen(true);
              }}
            >
              Buy Now
            </Button>
          </div>
        </CardContent>
      </Link>

      <BuyNowModal
        product={{
          id: id || '',
          name,
          description,
          price,
          originalPrice: originalPrice || price,
          images: processedImages,
          features,
          rating,
          inStock,
          category: '',
          fullDescription: description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }}
        isOpen={isBuyOpen}
        onClose={() => setIsBuyOpen(false)}
      />
    </Card>
  );
};

export default ProductCard;
