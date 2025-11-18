import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Users, Star, Tag, Package, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductManager from "@/components/ProductManager";
import OrdersManager from "@/components/OrdersManager";
import ContactsManager from "@/components/ContactsManager";
import { useProducts } from "@/contexts/ProductContext";

const Admin = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { products } = useProducts();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  const stats = [
    { title: "Total Orders", value: "248", icon: ShoppingBag, color: "text-primary" },
    { title: "Total Customers", value: "186", icon: Users, color: "text-accent" },
    { title: "Total Products", value: products.length.toString(), icon: Package, color: "text-secondary" },
    { title: "Avg Rating", value: "4.8", icon: Star, color: "text-accent" },
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back!</p>
          </div>
          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="coupons">Coupons</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-black mt-1">{stat.value}</p>
                      </div>
                      <stat.icon className={`h-10 w-10 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products">
            <ProductManager />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManager />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsManager />
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No reviews yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Active Coupons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active coupons</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
