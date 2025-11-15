import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
import ProductSearch from "@/components/ProductSearch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useProducts } from "@/contexts/ProductContext";

const Shop = () => {
  const { products } = useProducts();
  const [priceRange, setPriceRange] = useState([0, 12000]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");

  console.log('🛍️ Shop page - Current products:', products.map(p => ({ id: p.id, name: p.name })));

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

  let filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="min-h-screen">
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Shop</h1>
          <p className="text-muted-foreground">Browse our premium pollution protection products</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <ProductSearch
            placeholder="Search products by name, category, or features..."
            onSearch={setSearchQuery}
            className="max-w-xl w-full"
          />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Category</h4>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat === "all" ? "All Products" : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Price Range</h4>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={12000}
                  step={100}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="text-sm font-medium mb-3">Sort By</h4>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => {
                  setPriceRange([0, 12000]);
                  setSelectedCategory("all");
                  setSortBy("featured");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid
              products={filteredProducts}
              title={filteredProducts.length === products.length ? "All Products" : "Filtered Results"}
              subtitle={`${filteredProducts.length} products found`}
              itemsPerPage={8}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
