import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        // Simple token validation (in production, validate with server)
        try {
          const decoded = atob(token);
          const [email] = decoded.split(':');
          if (email) {
            setIsAuthenticated(true);
          }
        } catch (error) {
          // Invalid token, remove it
          localStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback((token: string) => {
    setIsAuthenticated(true);
    navigate('/admin');
  }, [navigate]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  }, [navigate]);

  // Don't render children until we've checked auth state
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  const value = {
    isAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
