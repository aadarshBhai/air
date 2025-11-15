import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductContext';

interface ProductSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const ProductSearch = ({ 
  placeholder = "Search products...", 
  onSearch,
  className = "" 
}: ProductSearchProps) => {
  const { products } = useProducts();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof products>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Generate suggestions based on input
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.features.some(feature => feature.toLowerCase().includes(lowerQuery))
    ).slice(0, 8); // Limit to 8 suggestions

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  }, [query, products]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (product: typeof products[0]) => {
    setQuery(product.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onSearch) {
      onSearch(product.name);
    }
  };

  const handleSearch = () => {
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onSearch) {
      onSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onSearch) {
      onSearch('');
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="font-semibold text-primary">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {suggestions.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              onClick={() => selectSuggestion(product)}
              className={`block p-3 hover:bg-muted/50 transition-colors cursor-pointer ${
                index === selectedIndex ? 'bg-muted/50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {highlightMatch(product.name, query)}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {highlightMatch(product.category, query)}
                  </div>
                  <div className="text-xs text-primary font-semibold">
                    ₹{product.price.toLocaleString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
