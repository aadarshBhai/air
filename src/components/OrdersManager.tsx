import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Eye, Download, CheckCircle, Truck, Package, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  orderId: string;
  productName: string;
  price: number;
  customerInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
    shippingAddress: string;
    city: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentScreenshot?: {
    name: string;
    size: number;
    type: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
  updatedAt?: string;
}

const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('📋 Fetching orders from:', `${import.meta.env.VITE_API_URL || 'https://air-couq.onrender.com'}/api/orders`);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://air-couq.onrender.com'}/api/orders`);
      console.log('📋 Orders response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Orders data received:', data);
        setOrders(data.orders || []);
        console.log('📋 Orders set:', data.orders?.length || 0);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://air-couq.onrender.com'}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success('Order status updated successfully');
        fetchOrders(); // Refresh orders
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://air-couq.onrender.com'}/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Order deleted successfully');
        fetchOrders(); // Refresh orders
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Package className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerInfo.phoneNumber.includes(searchQuery) ||
                         order.productName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <Button onClick={fetchOrders} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by order ID, name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.orderId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{order.orderId}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium">{order.productName}</p>
                        <p className="text-muted-foreground">₹{order.price}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium">{order.customerInfo.fullName}</p>
                        <p className="text-muted-foreground">{order.customerInfo.phoneNumber}</p>
                        <p className="text-muted-foreground text-xs">{order.customerInfo.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {order.customerInfo.shippingAddress}, {order.customerInfo.city} - {order.customerInfo.pincode}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {order.paymentScreenshot && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          Payment screenshot: {order.paymentScreenshot.name}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetails(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {order.paymentScreenshot && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          window.open(
                            `${import.meta.env.VITE_API_URL || 'https://air-couq.onrender.com'}/uploads/payment${order.orderId}.jpg`,
                            '_blank'
                          );
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteOrder(order.orderId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Status Update Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  {order.status !== 'confirmed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateOrderStatus(order.orderId, 'confirmed')}
                    >
                      Confirm
                    </Button>
                  )}
                  {order.status !== 'shipped' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateOrderStatus(order.orderId, 'shipped')}
                    >
                      Mark Shipped
                    </Button>
                  )}
                  {order.status !== 'delivered' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateOrderStatus(order.orderId, 'delivered')}
                    >
                      Mark Delivered
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Order Details - {selectedOrder.orderId}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Product</p>
                  <p>{selectedOrder.productName}</p>
                </div>
                <div>
                  <p className="font-medium">Price</p>
                  <p>₹{selectedOrder.price}</p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p>{selectedOrder.paymentMethod}</p>
                </div>
              </div>
              
              <div>
                <p className="font-medium mb-2">Customer Information</p>
                <div className="bg-muted/30 p-3 rounded">
                  <p>{selectedOrder.customerInfo.fullName}</p>
                  <p>{selectedOrder.customerInfo.email}</p>
                  <p>{selectedOrder.customerInfo.phoneNumber}</p>
                  <p className="mt-2">{selectedOrder.customerInfo.shippingAddress}</p>
                  <p>{selectedOrder.customerInfo.city} - {selectedOrder.customerInfo.pincode}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
