import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import { Product } from '@/data/products';

// Ensure the API URL ends with /api
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '') + '/api';
// Extend the InternalAxiosRequestConfig to include the headers property
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  headers: AxiosHeaders;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || new AxiosHeaders();
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config as InternalAxiosRequestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Type guard for File
const isFile = (value: unknown): value is File => {
  return value instanceof File || (typeof value === 'object' && value !== null && 'name' in value && 'type' in value);
};

// Product API service
export const productApi = {
  // Get all products
  async getAll(): Promise<Product[]> {
    try {
      const response = await api.get('/products');
      const data = response.data.data || response.data.products || response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product by ID
  async getById(id: string): Promise<Product> {
    try {
      const response = await api.get(`/products/${id}`);
      const data = response.data.data || response.data;
      // Ensure consistent ID field
      if (data._id && !data.id) {
        data.id = data._id;
      }
      return data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Create new product
  async create(productData: Omit<Product, 'id'>): Promise<Product> {
    try {
      const formData = new FormData();
      
      // Append all product data to formData
      Object.entries(productData).forEach(([key, value]) => {
        if (key === 'images' && Array.isArray(value)) {
          // Handle multiple images
          value.forEach((file, index) => {
            if (isFile(file)) {
              formData.append('images', file);
            } else if (typeof file === 'string') {
              formData.append(`images[${index}]`, file);
            }
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data.data || response.data;
      // Ensure consistent ID field
      if (data._id && !data.id) {
        data.id = data._id;
      }
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Session expired. Please log in again.');
        } else if (error.response?.status === 400) {
          throw new Error(error.response.data?.message || 'Invalid product data');
        }
      }
      throw error;
    }
  },

  // Update product
  async update(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const formData = new FormData();
      
      // Append updated fields to formData
      Object.entries(productData).forEach(([key, value]) => {
        if (key === 'images' && Array.isArray(value)) {
          // Handle multiple images
          value.forEach((file, index) => {
            if (isFile(file)) {
              formData.append('images', file);
            } else if (typeof file === 'string') {
              formData.append(`images[${index}]`, file);
            }
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data.data || response.data;
      // Ensure consistent ID field
      if (data._id && !data.id) {
        data.id = data._id;
      }
      return data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Delete product
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  // Upload product images
  async uploadImages(images: File[]): Promise<string[]> {
    try {
      const formData = new FormData();
      images.forEach((file) => {
        formData.append('images', file);
      });

      const response = await api.post('/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.urls || [];
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },
};

// For backward compatibility
export const fetchProducts = productApi.getAll;
export const createProduct = productApi.create;
export const updateProduct = productApi.update;
export const deleteProduct = productApi.delete;