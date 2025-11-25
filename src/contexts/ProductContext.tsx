import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, products as initialProducts } from '@/data/products';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  retryCount: number;
  retry: () => void;
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
  const [retryCount, setRetryCount] = useState(0);

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async (attempt = 1) => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API first
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        console.log('📦 Fetching products from:', `${import.meta.env.VITE_API_URL}/api/products`);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
        
        console.log('📦 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Products fetched from API:', data.length);
          console.log('📦 First product:', data[0]);
          setProducts(data);
          // Save to localStorage as cache
          localStorage.setItem('products', JSON.stringify(data));
          setRetryCount(0); // Reset retry count on success
        } else {
          throw new Error(`API responded with ${response.status}`);
        }
      } catch (error: any) {
        console.error('Error fetching products from API:', error);
        
        if (error.name === 'AbortError') {
          setError('Request timed out. Please check your connection.');
        } else if (error.message.includes('Failed to fetch')) {
          setError('Network error. Backend may be down.');
        } else {
          setError(`Failed to load products: ${error.message}`);
        }
        
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
  }, [retryCount]);

  const retry = () => {
    setRetryCount(prev => prev + 1);
  };

  const addProduct = (newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Ensure we're not storing blob URLs
    const sanitizedProduct = {
      ...newProduct,
      // Filter out any blob URLs from images array
      images: (newProduct.images || []).filter((img: string) => !img.startsWith('blob:'))
    };

    const product: Product = {
      ...sanitizedProduct,
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
    // Ensure we're not storing blob URLs
    const sanitizedUpdates = {
      ...updates,
      // Filter out any blob URLs from images array if it exists in updates
      ...(updates.images && {
        images: updates.images.filter((img: string) => !img.startsWith('blob:'))
      })
    };

    const updatedProducts = products.map(product =>
      product.id === id
        ? { 
            ...product, 
            ...sanitizedUpdates, 
            updatedAt: new Date().toISOString() 
          }
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
    <ProductContext.Provider value={{ products, loading, error, retryCount, retry, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
