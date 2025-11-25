import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { Product } from "@/data/products";
import { toast } from "sonner";

const ProductManager = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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

  const categories = ['Masks', 'Air Purifiers', 'Accessories', 'Kids', 'Sports', 'Car'];

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
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < Math.min(files.length, 6); i++) {
        const file = files[i];
        const form = new FormData();
        form.append('file', file);
        form.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`, {
          method: 'POST',
          body: form
        });
        const data = await res.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      }

      // Filter out any existing blob URLs before adding new ones
      const existingUrls = formData.images.filter(url => !url.startsWith('blob:'));
      
      setFormData(prev => ({
        ...prev,
        images: [...existingUrls, ...uploadedUrls].slice(0, 6)
      }));

    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Image upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      fullDescription: formData.fullDescription,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : undefined,
      images: formData.images,
      category: formData.category,
      rating: parseFloat(formData.rating),
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      inStock: formData.inStock
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully!');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully!');
      }

      resetForm();
      setIsAddDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(`Failed to ${editingProduct ? 'update' : 'add'} product. Please try again.`);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    // Filter out any blob URLs from the product's images
    const sanitizedImages = (product.images || []).filter(img => 
      img && (img.startsWith('http') || img.startsWith('data:image'))
    );
    
    setFormData({
      name: product.name,
      description: product.description,
      fullDescription: product.fullDescription,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      discountPercentage: product.discountPercentage?.toString() || '',
      images: sanitizedImages,
      category: product.category,
      rating: product.rating.toString(),
      features: product.features ? product.features.join(', ') : '',
      inStock: product.inStock
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogDescription>
                  {editingProduct 
                    ? 'Update the product details below.' 
                    : 'Fill in the form below to add a new product.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Name */}
                <div className="col-span-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>

                {/* Short Description */}
                <div className="col-span-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                </div>

                {/* Full Description */}
                <div className="col-span-2">
                  <Label htmlFor="fullDescription">Full Description</Label>
                  <Textarea id="fullDescription" value={formData.fullDescription} onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })} rows={3} />
                </div>

                {/* Price & Original Price */}
                <div>
                  <Label htmlFor="price">Sale Price (₹)</Label>
                  <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input id="originalPrice" type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} />
                </div>

                {/* Discount & Category */}
                <div>
                  <Label htmlFor="discountPercentage">Discount %</Label>
                  <Input id="discountPercentage" type="number" value={formData.discountPercentage} onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>{categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                {/* Rating */}
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
                    <SelectTrigger><SelectValue placeholder="Rating" /></SelectTrigger>
                    <SelectContent>{[5,4.5,4,3.5,3,2.5,2,1.5,1].map(r => <SelectItem key={r} value={r.toString()}>{r} ⭐</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <Label>Product Images (Max 6)</Label>
                  <input type="file" id="images" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  <div className="grid grid-cols-3 gap-4">
                    {formData.images
                      .filter(img => 
                        img && 
                        !img.startsWith('blob:') && 
                        (img.startsWith('http') || img.startsWith('data:image'))
                      )
                      .map((img, i) => (
                        <div key={i} className="relative group">
                          <div className="aspect-square border rounded-md overflow-hidden">
                            <img 
                              src={img} 
                              alt={`Preview ${i + 1}`} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                // If image fails to load, remove it from the list
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                setFormData(prev => ({
                                  ...prev,
                                  images: prev.images.filter((_, idx) => idx !== i)
                                }));
                              }}
                            />
                          </div>
                          <button 
                            type="button" 
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" 
                            onClick={() => setFormData(prev => ({
                              ...prev, 
                              images: prev.images.filter((_, idx) => idx !== i)
                            }))}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    {formData.images.length < 6 && (
                      <label htmlFor="images" className="aspect-square border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="text-center p-4"><Plus className="w-6 h-6 mx-auto text-muted-foreground" /><span className="text-xs text-muted-foreground">{formData.images.length === 0 ? 'Add Images' : 'Add More'}</span></div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="col-span-2">
                  <Label htmlFor="features">Features (comma-separated)</Label>
                  <Textarea 
                    id="features" 
                    value={formData.features} 
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })} 
                    rows={2} 
                    placeholder="Enter features separated by commas"
                  />
                </div>

                {/* In Stock Toggle */}
                <div className="col-span-2 flex items-center space-x-2">
                  <Switch 
                    id="inStock" 
                    checked={formData.inStock} 
                    onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })} 
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>

                {/* Form Buttons */}
                <div className="col-span-2 flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      setIsAddDialogOpen(false);
                      setEditingProduct(null);
                    }}
                  >
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

      {/* Product List */}
      <div className="grid gap-4">
        {products.map(product => {
          const discount = calculateDiscount(product);
          // Filter out any invalid image URLs
          const validImages = (product.images || []).filter(img => 
            img && (img.startsWith('http') || img.startsWith('data:image'))
          );
          
          return (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {validImages.length > 0 ? (
                      <img 
                        src={validImages[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
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
                          <Badge variant={product.inStock ? 'default' : 'destructive'}>{product.inStock ? 'In Stock' : 'Out of Stock'}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">₹{product.price}</span>
                          {product.originalPrice && <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>}
                          {discount > 0 && <Badge variant="destructive">{discount}% OFF</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(product)}><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 mb-1">Rating: {product.rating} ⭐</div>
                      <div>Features: {product.features ? product.features.join(', ') : 'No features'}</div>
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
