import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LiveOrderTracker from '@/components/LiveOrderTracker';
import type { LiveOrderTrackerProps, OrderStatus } from '@/components/LiveOrderTracker'; // Import type
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, ShoppingBag, Edit3, LogOut, MapPin, CreditCardIcon } from 'lucide-react';

// Sample data
const userProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  // profilePictureUrl: z.string().url().optional(),
});

type UserProfile = z.infer<typeof userProfileSchema>;

const sampleUserProfile: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '555-123-4567',
  // profilePictureUrl: 'https://via.placeholder.com/150/007BFF/FFFFFF?Text=JD'
};

const sampleUserProfileImage = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60';


interface PastOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}
interface PastOrder {
  id: string;
  date: string;
  totalAmount: number;
  status: OrderStatus;
  restaurantName: string;
  items: PastOrderItem[];
  deliveryAddress: string;
}

const samplePastOrders: PastOrder[] = [
  { id: 'order123', date: '2023-10-26', totalAmount: 25.99, status: 'DELIVERED', restaurantName: 'Pizza Palace', items: [{id: 'p1', name: 'Margherita', quantity: 1, price: 12.99}, {id: 'd1', name: 'Coke', quantity: 2, price: 6.50}], deliveryAddress: '123 Main St, Anytown' },
  { id: 'order456', date: '2023-10-20', totalAmount: 18.50, status: 'DELIVERED', restaurantName: 'Sushi Heaven', items: [{id: 's2', name: 'California Roll', quantity: 2, price: 7.50}, {id: 's3', name: 'Edamame', quantity: 1, price: 3.50}], deliveryAddress: '123 Main St, Anytown' },
  { id: 'order789', date: '2023-11-01', totalAmount: 33.00, status: 'CANCELLED', restaurantName: 'Burger Barn', items: [{id: 'b1', name: 'Cheeseburger', quantity: 2, price: 16.50}], deliveryAddress: '456 Business Ave, Anytown' },
];

const sampleActiveOrder: LiveOrderTrackerProps = {
  orderId: 'activeOrder001',
  status: 'OUT_FOR_DELIVERY',
  estimatedDeliveryTime: 'Approximately 15 minutes',
};

const ProfileAndOrdersPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const profileForm = useForm<UserProfile>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: sampleUserProfile,
  });

  useEffect(() => {
    console.log('ProfileAndOrdersPage loaded');
    profileForm.reset(sampleUserProfile); // Reset form when sample data changes or on mount
  }, [profileForm]);

  const onProfileSubmit = (values: UserProfile) => {
    console.log('Profile updated:', values);
    // Here, you would typically send data to an API
    // For demo: update sampleUserProfile (won't persist across reloads)
    // Object.assign(sampleUserProfile, values);
    setIsEditingProfile(false);
    alert("Profile updated successfully (simulated)!");
  };

  const handleLogout = () => {
    console.log("User logging out...");
    // Implement actual logout logic (e.g., clear tokens, redirect to login)
    alert("Logged out (simulated).");
    // navigate('/login');
  }

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
                <NavigationMenuLink href="/cart" className="px-3 py-2 text-sm font-medium hover:text-green-600">Cart</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                 <Button variant="ghost" onClick={handleLogout} size="sm"><LogOut className="mr-2 h-4 w-4" />Logout</Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8">My Account</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2"><User className="h-4 w-4"/>My Profile</TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2"><ShoppingBag className="h-4 w-4"/>Order History</TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2"><MapPin className="h-4 w-4"/>Saved Addresses</TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2"><CreditCardIcon className="h-4 w-4"/>Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Profile Information</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(!isEditingProfile)}>
                  <Edit3 className="mr-2 h-4 w-4" />{isEditingProfile ? 'Cancel' : 'Edit Profile'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={sampleUserProfileImage} alt={sampleUserProfile.name} />
                        <AvatarFallback>{sampleUserProfile.name.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {!isEditingProfile && (
                        <div>
                            <p className="text-2xl font-semibold">{profileForm.getValues('name')}</p>
                            <p className="text-gray-600">{profileForm.getValues('email')}</p>
                            <p className="text-gray-600">{profileForm.getValues('phone') || 'No phone number provided'}</p>
                        </div>
                    )}
                </div>
                {isEditingProfile ? (
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <FormField control={profileForm.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={profileForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={profileForm.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl><Input type="tel" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      {/* Add profile picture upload field if needed */}
                      <Button type="submit">Save Changes</Button>
                    </form>
                  </Form>
                ) : null }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Active Order</CardTitle>
                <CardDescription>Track your current food delivery.</CardDescription>
              </CardHeader>
              <CardContent>
                {sampleActiveOrder ? (
                    <LiveOrderTracker {...sampleActiveOrder} />
                ) : (
                    <p className="text-gray-600">You have no active orders at the moment.</p>
                )}
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Past Orders</CardTitle>
                <CardDescription>Review your previous orders.</CardDescription>
              </CardHeader>
              <CardContent>
                {samplePastOrders.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {samplePastOrders.map(order => (
                      <AccordionItem value={order.id} key={order.id}>
                        <AccordionTrigger>
                          <div className="flex justify-between w-full pr-4">
                            <div>
                                <span className="font-medium">Order #{order.id.substring(0,7)}... from {order.restaurantName}</span>
                                <span className="text-sm text-gray-500 block">Placed on: {new Date(order.date).toLocaleDateString()}</span>
                            </div>
                            <Badge variant={order.status === 'DELIVERED' ? 'default' : (order.status === 'CANCELLED' ? 'destructive' : 'secondary')}>{order.status}</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 text-sm">
                          <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                          <p><strong>Delivered To:</strong> {order.deliveryAddress}</p>
                          <p><strong>Items:</strong></p>
                          <ul className="list-disc pl-5">
                            {order.items.map(item => (
                                <li key={item.id}>{item.name} (x{item.quantity}) - ${item.price.toFixed(2)} each</li>
                            ))}
                          </ul>
                           <Button variant="outline" size="sm" className="mt-2">Reorder</Button>
                           <Button variant="link" size="sm">View Invoice</Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-gray-600">You have no past orders.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="addresses">
            <Card>
                <CardHeader>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Placeholder for address management UI */}
                    <p className="text-gray-600">Address management functionality coming soon.</p>
                    <Button className="mt-4">Add New Address</Button>
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
                <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your saved payment options.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Placeholder for payment methods UI */}
                    <p className="text-gray-600">Payment method management functionality coming soon.</p>
                     <Button className="mt-4">Add New Payment Method</Button>
                </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>

      <footer className="py-6 text-center text-sm text-gray-600 border-t bg-white">
        Manage your account details and preferences.
      </footer>
    </div>
  );
};

export default ProfileAndOrdersPage;