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

  const demoOrders = [
    { id: "ORD001", customer: "Amit Kumar", product: "N95 Mask Pro", amount: 499, status: "Pending", date: "2025-01-10" },
    { id: "ORD002", customer: "Sneha Patel", product: "Smart Air Purifier", amount: 3999, status: "Verified", date: "2025-01-10" },
    { id: "ORD003", customer: "Raj Sharma", product: "Kids Mask", amount: 349, status: "Shipped", date: "2025-01-09" },
    { id: "ORD004", customer: "Priya Singh", product: "Car Purifier", amount: 1499, status: "Delivered", date: "2025-01-08" },
  ];

  const demoReviews = [
    { id: 1, customer: "Vikram", product: "N95 Mask Pro", rating: 5, comment: "Excellent quality!" },
    { id: 2, customer: "Anita", product: "Smart Air Purifier", rating: 4, comment: "Works great" },
    { id: 3, customer: "Rohit", product: "Sports Mask", rating: 5, comment: "Very comfortable" },
  ];

  const demoCoupons = [
    { code: "WELCOME10", discount: "10%", expires: "2025-02-01", uses: 45 },
    { code: "SAVE20", discount: "20%", expires: "2025-01-20", uses: 23 },
    { code: "BULK50", discount: "₹50 OFF", expires: "2025-03-01", uses: 12 },
  ];

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
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back!</p>
          </div>
          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
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
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell>₹{order.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "Delivered"
                                ? "default"
                                : order.status === "Shipped"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
                <div className="space-y-4">
                  {demoReviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold">{review.customer}</p>
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{review.product}</p>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
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
                <div className="space-y-4">
                  {demoCoupons.map((coupon, idx) => (
                    <div key={idx} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-mono font-bold text-lg">{coupon.code}</p>
                          <p className="text-sm text-muted-foreground">Expires: {coupon.expires}</p>
                        </div>
                        <Badge variant="secondary">{coupon.discount}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Used {coupon.uses} times</p>
                    </div>
                  ))}
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
