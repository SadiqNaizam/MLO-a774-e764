import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddressSelectorCard from '@/components/AddressSelectorCard';
import type { Address } from '@/components/AddressSelectorCard'; // Import type if defined in component
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm } from '@/components/ui/form'; // Assuming Form is from shadcn
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreditCard, Home, Truck, Wallet } from 'lucide-react';

// Sample data
const sampleAddresses: Address[] = [
  { id: 'addr1', type: 'Home', line1: '123 Main St', city: 'Anytown', state: 'CA', zip: '90210', country: 'USA' },
  { id: 'addr2', type: 'Work', line1: '456 Business Ave', line2: 'Suite 100', city: 'Anytown', state: 'CA', zip: '90211', country: 'USA' },
];

const paymentMethods = [
  { id: 'pm1', name: 'Visa **** 1234', type: 'Card', icon: CreditCard },
  { id: 'pm2', name: 'PayPal', type: 'Wallet', icon: Wallet },
  { id: 'pm3', name: 'Cash on Delivery', type: 'COD', icon: Truck },
];

const addressSchema = z.object({
  line1: z.string().min(1, "Street address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "Zip code must be at least 5 characters"),
  country: z.string().min(1, "Country is required"),
  type: z.string().optional(),
});

const CheckoutPage = () => {
  const [savedAddresses] = useState<Address[]>(sampleAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(sampleAddresses[0]?.id || null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(paymentMethods[0]?.id || null);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: { line1: '', line2: '', city: '', state: '', zip: '', country: 'USA', type: 'Home' },
  });

  useEffect(() => {
    console.log('CheckoutPage loaded');
    if (savedAddresses.length === 0) {
        setShowNewAddressForm(true);
    }
  }, [savedAddresses]);

  const handlePlaceOrder = () => {
    if (!selectedAddressId && !form.formState.isValid && showNewAddressForm) {
      alert("Please select or enter a valid delivery address.");
      return;
    }
    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    console.log('Placing order with address ID:', selectedAddressId || 'New Address', 'and payment method:', selectedPaymentMethod);
    // Simulate order placement
    setShowOrderConfirmation(true);
  };

  const onNewAddressSubmit = (values: z.infer<typeof addressSchema>) => {
    console.log("New address submitted:", values);
    // In a real app, save this address and then select it
    const newAddrId = `addr${Date.now()}`;
    const newAddress: Address = { ...values, id: newAddrId };
    // setSavedAddresses(prev => [...prev, newAddress]); // This would typically be an API call
    setSelectedAddressId(newAddrId); // Select the newly added address for this order
    setShowNewAddressForm(false);
    form.reset();
    alert("New address saved (simulated). Please ensure it is selected."); // User needs to select it from the list if not auto-selected.
  };

  // Dummy order summary details
  const orderSubtotal = 55.47;
  const orderDeliveryFee = 5.00;
  const orderTaxes = 4.44;
  const orderTotal = orderSubtotal + orderDeliveryFee + orderTaxes;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-700">FoodieFleet</Link>
          {/* Minimal navigation during checkout */}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/cart">Cart</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Checkout</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-semibold mb-8 text-center">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Truck className="mr-2 h-6 w-6 text-green-600" /> Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                {savedAddresses.length > 0 && !showNewAddressForm && (
                  <div className="space-y-4 mb-4">
                    {savedAddresses.map(addr => (
                      <AddressSelectorCard
                        key={addr.id}
                        address={addr}
                        isSelected={selectedAddressId === addr.id}
                        onSelect={() => { setSelectedAddressId(addr.id); setShowNewAddressForm(false); }}
                        // onEdit={(id) => console.log('Edit address', id)} // Implement edit functionality
                        // onDelete={(id) => console.log('Delete address', id)} // Implement delete functionality
                      />
                    ))}
                  </div>
                )}
                <Button variant="outline" onClick={() => { setShowNewAddressForm(s => !s); if (!showNewAddressForm) setSelectedAddressId(null); }}>
                  {showNewAddressForm ? 'Cancel Adding New Address' : (savedAddresses.length > 0 ? 'Add New Address' : 'Add Delivery Address')}
                </Button>

                {showNewAddressForm && (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onNewAddressSubmit)} className="mt-6 space-y-4">
                      <FormField control={form.control} name="line1" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField control={form.control} name="line2" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apartment, suite, etc. (Optional)</FormLabel>
                          <FormControl><Input placeholder="Apt B" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="city" render={({ field }) => (
                          <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Anytown" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="state" render={({ field }) => (
                          <FormItem><FormLabel>State / Province</FormLabel><FormControl><Input placeholder="CA" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="zip" render={({ field }) => (
                          <FormItem><FormLabel>Zip / Postal Code</FormLabel><FormControl><Input placeholder="90210" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="country" render={({ field }) => (
                          <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="USA" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                       <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem><FormLabel>Address Type (Optional)</FormLabel><FormControl><Input placeholder="Home, Work" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="submit" className="w-full sm:w-auto">Save New Address</Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            {/* Payment Method Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><CreditCard className="mr-2 h-6 w-6 text-green-600" /> Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPaymentMethod || undefined} onValueChange={setSelectedPaymentMethod}>
                  {paymentMethods.map(pm => (
                    <Label key={pm.id} htmlFor={pm.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer has-[:checked]:border-green-500 has-[:checked]:ring-1 has-[:checked]:ring-green-500">
                      <RadioGroupItem value={pm.id} id={pm.id} />
                      <pm.icon className="h-5 w-5 text-gray-600" />
                      <span>{pm.name}</span>
                    </Label>
                  ))}
                </RadioGroup>
                {/* Could add a form here to input new card details */}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Section */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24"> {/* Make summary sticky */}
              <CardHeader>
                <CardTitle>Order Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Dummy items for review, in real app, fetch from cart state */}
                <div className="flex justify-between text-sm"><span>Margherita Pizza x 1</span><span>$12.99</span></div>
                <div className="flex justify-between text-sm"><span>California Roll x 2</span><span>$15.00</span></div>
                <Separator />
                <div className="flex justify-between"><span>Subtotal</span><span>${orderSubtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery Fee</span><span>${orderDeliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Taxes (est.)</span><span>${orderTaxes.toFixed(2)}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full" onClick={handlePlaceOrder} disabled={(!selectedAddressId && !form.formState.isValid) || !selectedPaymentMethod}>
                  Place Order
                </Button>
              </CardFooter>
            </Card>
          </aside>
        </div>

        <AlertDialog open={showOrderConfirmation} onOpenChange={setShowOrderConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Order Confirmed!</AlertDialogTitle>
              <AlertDialogDescription>
                Your order has been placed successfully. You will receive an email confirmation shortly.
                You can track your order in the 'My Orders' section.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => navigate('/profile-orders')}>View Orders</AlertDialogAction>
              <AlertDialogCancel onClick={() => navigate('/')}>Continue Shopping</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>

      <footer className="py-6 text-center text-sm text-gray-600 border-t bg-white">
        Secure Checkout.
      </footer>
    </div>
  );
};

export default CheckoutPage;