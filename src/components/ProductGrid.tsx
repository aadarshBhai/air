import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGridProps {
  products: any[];
  title?: string;
  subtitle?: string;
  itemsPerPage?: number;
  className?: string;
}

const ProductGrid = ({ 
  products, 
  title, 
  subtitle, 
  className = "" 
}: ProductGridProps) => {
  // Show all products without pagination
  const currentProducts = products;

  console.log('📦 ProductGrid received products:', products.length);
  console.log('📦 First product in grid:', products[0]);
  
  if (products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No products found.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      {/* Products Grid - Responsive Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

    </div>
  );
};

export default ProductGrid;
