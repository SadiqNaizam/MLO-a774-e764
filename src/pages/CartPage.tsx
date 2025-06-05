import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, PlusCircle, MinusCircle, ShoppingCart } from 'lucide-react';

// Sample cart item structure
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  restaurantName?: string; // Optional: if cart can have items from multiple restaurants
}

// Sample cart data
const initialCartItems: CartItem[] = [
  { id: 'p1', name: 'Margherita Pizza', price: 12.99, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60', restaurantName: 'Pizza Palace' },
  { id: 's2', name: 'California Roll', price: 7.50, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FsaWZvcm5pYSUyMHJvbGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60', restaurantName: 'Sushi Heaven' },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CartPage loaded');
    // In a real app, fetch cart items from global state or API
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id); // Or set to 1 if you don't want removal this way
      return;
    }
    setCartItems(items => items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    console.log(`Removed item ${id} from cart.`);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0; // Example fixed delivery fee
  const taxes = subtotal * 0.08; // Example 8% tax
  const total = subtotal + deliveryFee + taxes;

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
        alert("Your cart is empty. Please add items before proceeding to checkout.");
        return;
    }
    console.log('Proceeding to checkout with items:', cartItems);
    navigate('/checkout');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-700">FoodieFleet</Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className="px-3 py-2 text-sm font-medium hover:text-green-600">Home</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/profile-orders" className="px-3 py-2 text-sm font-medium hover:text-green-600">Profile</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Your Cart</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section aria-labelledby="cart-items-heading" className="lg:col-span-2">
            <h2 id="cart-items-heading" className="text-2xl font-semibold mb-6">Shopping Cart ({cartItems.length} items)</h2>
            {cartItems.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-xl font-medium mb-2">Your cart is empty.</p>
                  <p className="text-gray-600 mb-4">Looks like you haven't added anything to your cart yet.</p>
                  <Button onClick={() => navigate('/')}>Start Shopping</Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] hidden sm:table-cell">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="hidden sm:table-cell">
                            <Avatar className="h-16 w-16 rounded-md">
                              <AvatarImage src={item.imageUrl} alt={item.name} />
                              <AvatarFallback>{item.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{item.name}</p>
                            {item.restaurantName && <p className="text-xs text-gray-500">{item.restaurantName}</p>}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                <PlusCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium">${(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>
                              <Trash2 className="h-5 w-5 text-red-500 hover:text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </section>

          <aside className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (est.)</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4 items-stretch">
                 <div className="flex space-x-2">
                    <Input
                        type="text"
                        placeholder="Promo Code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        aria-label="Promotional code"
                        disabled={cartItems.length === 0}
                    />
                    <Button variant="outline" disabled={!promoCode || cartItems.length === 0}>Apply</Button>
                 </div>
                <Button size="lg" className="w-full" onClick={handleProceedToCheckout} disabled={cartItems.length === 0}>
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </aside>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-600 border-t bg-white">
        Review your order before checking out.
      </footer>
    </div>
  );
};

export default CartPage;