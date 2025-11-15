import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, products as initialProducts } from '@/data/products';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  // Load products from localStorage or use initial products as fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        return JSON.parse(savedProducts);
      }
      // Save initial products to localStorage on first load
      localStorage.setItem('products', JSON.stringify(initialProducts));
      return initialProducts;
    } catch (error) {
      console.error('Error loading products from localStorage:', error);
      return initialProducts;
    }
  });

  const addProduct = (newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const product: Product = {
      ...newProduct,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const updateProduct = (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const updatedProducts = products.map(product =>
      product.id === id
        ? { ...product, ...updates, updatedAt: new Date().toISOString() }
        : product
    );
    setProducts(updatedProducts);
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const deleteProduct = (id: string) => {
    console.log('🗑️ ProductContext.deleteProduct called with ID:', id);
    console.log('📦 Products before deletion:', products.map(p => ({ id: p.id, name: p.name })));
    
    const filteredProducts = products.filter(p => p.id !== id);
    console.log('📦 Products after deletion:', filteredProducts.map(p => ({ id: p.id, name: p.name })));
    
    setProducts(filteredProducts);
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(filteredProducts));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
