import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, products as initialProducts } from '@/data/products';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API first
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Products fetched from API:', data.length);
          setProducts(data);
          // Save to localStorage as cache
          localStorage.setItem('products', JSON.stringify(data));
        } else {
          throw new Error(`API responded with ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching products from API:', error);
        setError('Failed to load products from server');
        
        // Fallback to localStorage
        try {
          const savedProducts = localStorage.getItem('products');
          if (savedProducts) {
            const cachedProducts = JSON.parse(savedProducts);
            console.log('📦 Using cached products:', cachedProducts.length);
            setProducts(cachedProducts);
            setError(null); // Clear error since we have fallback
          } else {
            console.log('📦 Using initial products');
            setProducts(initialProducts);
            localStorage.setItem('products', JSON.stringify(initialProducts));
          }
        } catch (localStorageError) {
          console.error('Error reading from localStorage:', localStorageError);
          setProducts(initialProducts);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
    <ProductContext.Provider value={{ products, loading, error, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
