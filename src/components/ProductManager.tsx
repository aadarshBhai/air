import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { Product } from "@/data/products";
import { toast } from "sonner";

const ProductManager = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fullDescription: '',
    price: '',
    originalPrice: '',
    discountPercentage: '',
    images: [] as string[],
    category: '',
    rating: '5',
    features: '',
    inStock: true
  });

  const categories = [
    'Masks',
    'Air Purifiers', 
    'Accessories',
    'Kids',
    'Sports',
    'Car'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      fullDescription: '',
      price: '',
      originalPrice: '',
      discountPercentage: '',
      images: [],
      category: '',
      rating: '5',
      features: '',
      inStock: true
    });
    setUploadedImage(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newImages = [];
      
      // Process each selected file
      for (let i = 0; i < Math.min(files.length, 6); i++) {
        const file = files[i];
        // Create a preview URL for the selected image
        const previewUrl = URL.createObjectURL(file);
        newImages.push(previewUrl);
      }

      // Update form data with new images, keeping existing ones and limiting to 6 total
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 6)
      }));
      
      // Set the first uploaded image as the main preview
      if (newImages.length > 0) {
        setUploadedImage(newImages[0]);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload one or more images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure at least one image is uploaded
    if (formData.images.length === 0) {
      toast.error('Please upload at least one image for the product');
      return;
    }
    
    // Ensure we're only sending the first image until backend is updated
    const firstImage = formData.images[0];
    
    const productData = {
      name: formData.name,
      description: formData.description,
      fullDescription: formData.fullDescription,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : undefined,
      image: firstImage, // Temporarily using the first image for backward compatibility
      images: formData.images, // This will be used once backend is updated
      category: formData.category,
      rating: parseFloat(formData.rating),
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      inStock: formData.inStock
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      let response;

      if (editingProduct) {
        // Update existing product
        response = await fetch(`${apiUrl}/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
      } else {
        // Create new product
        response = await fetch(`${apiUrl}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
      }

      if (response.ok) {
        // Update local context
        if (editingProduct) {
          updateProduct(editingProduct.id, productData);
          toast.success("Product updated successfully!");
        } else {
          addProduct(productData);
          toast.success("Product added successfully!");
        }
        
        resetForm();
        setIsAddDialogOpen(false);
        setEditingProduct(null);
      } else {
        throw new Error('Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      // Fallback to local-only update
      if (editingProduct) {
        updateProduct(editingProduct.id, productData);
        toast.success("Product updated locally!");
      } else {
        addProduct(productData);
        toast.success("Product added locally!");
      }
      
      resetForm();
      setIsAddDialogOpen(false);
      setEditingProduct(null);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      fullDescription: product.fullDescription,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      discountPercentage: product.discountPercentage?.toString() || '',
      images: product.images || [],
      category: product.category,
      rating: product.rating.toString(),
      features: product.features ? product.features.join(', ') : '',
      inStock: product.inStock
    });
    // Set the first image as preview if available
    if (product.images?.[0]) {
      setUploadedImage(product.images[0]);
    }
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    console.log('🗑️ Attempting to delete product with ID:', id);
    console.log('📦 Current products before deletion:', products.map(p => ({ id: p.id, name: p.name })));
    
    if (window.confirm('Are you sure you want to delete this product?')) {
      console.log('✅ User confirmed deletion');
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/api/products/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Update local context
          deleteProduct(id);
          toast.success("Product deleted successfully!");
        } else {
          throw new Error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        // Fallback to local-only deletion
        deleteProduct(id);
        toast.success("Product deleted locally!");
      }
    } else {
      console.log('❌ User cancelled deletion');
    }
  };

  const calculateDiscount = (product: Product) => {
    if (product.originalPrice && product.price < product.originalPrice) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return product.discountPercentage || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <div className="flex gap-2">
          {/* Test Delete Button */}
          <Button 
            onClick={() => {
              if (products.length > 0) {
                const firstProduct = products[0];
                console.log('🧪 Test deleting first product:', firstProduct);
                handleDelete(firstProduct.id);
              } else {
                alert('No products to delete');
              }
            }}
            variant="outline"
            size="sm"
          >
            🧪 Test Delete First Product
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Smart Air Purifier"
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Compact air purifier with HEPA filter and smart controls"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="fullDescription">Full Description</Label>
                    <Textarea
                      id="fullDescription"
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      placeholder="Detailed product description..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Sale Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="3999"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="5999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="discountPercentage">Discount % (Optional)</Label>
                    <Input
                      id="discountPercentage"
                      type="number"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                      placeholder="33"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map(rating => (
                          <SelectItem key={rating} value={rating.toString()}>{rating} ⭐</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Images (Max 6)</Label>
                    <div className="space-y-4">
                      {/* Hidden file input */}
                      <input
                        type="file"
                        id="images"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      
                      {/* Image preview grid */}
                      <div className="grid grid-cols-3 gap-4">
                        {formData.images.map((img, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square border rounded-md overflow-hidden">
                              <img 
                                src={img} 
                                alt={`Preview ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData(prev => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== index)
                                }));
                              }}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        
                        {formData.images.length < 6 && (
                          <label 
                            htmlFor="images"
                            className="aspect-square border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                          >
                            <div className="text-center p-4">
                              <Plus className="w-6 h-6 mx-auto text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {formData.images.length === 0 ? 'Add Images' : 'Add More'}
                              </span>
                            </div>
                          </label>
                        )}
                      </div>

                      {/* OR Image URL - Removed as we're focusing on file upload */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-muted-foreground/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">OR</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="features">Features (comma-separated)</Label>
                    <Textarea
                      id="features"
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      placeholder="HEPA Filter, Smart Controls, Quiet Operation"
                      rows={2}
                    />
                  </div>

                  <div className="col-span-2 flex items-center space-x-2">
                    <Switch
                      id="inStock"
                      checked={formData.inStock}
                      onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                    />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {products.map((product) => {
          const discount = calculateDiscount(product);
          return (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{product.category}</Badge>
                          <Badge variant={product.inStock ? "default" : "destructive"}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-lg text-muted-foreground line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                          {discount > 0 && (
                            <Badge variant="destructive">{discount}% OFF</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 mb-1">
                        <span>Rating: {product.rating} ⭐</span>
                      </div>
                      <div>
                        Features: {product.features ? product.features.join(', ') : 'No features'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProductManager;
