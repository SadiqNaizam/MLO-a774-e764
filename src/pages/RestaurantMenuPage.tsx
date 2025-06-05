import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DishCard from '@/components/DishCard';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Star, Clock, ShoppingCart, PlusCircle, MinusCircle, X } from 'lucide-react';

// Sample data - in a real app, this would be fetched based on restaurantId
const sampleRestaurantDetails = {
  '1': {
    name: 'Pizza Palace',
    bannerUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGl6emElMjByZXN0YXVyYW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://via.placeholder.com/100/FFD700/000000?Text=PP',
    rating: 4.5,
    deliveryTimeEstimate: '25-35 min',
    description: 'Home of the tastiest pizzas in town. Fresh ingredients, classic recipes, and a whole lot of love in every slice.',
    menu: [
      { id: 'p1', name: 'Margherita Pizza', description: 'Classic delight with 100% real mozzarella cheese', price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', tags: ['Vegetarian', 'Popular'] },
      { id: 'p2', name: 'Pepperoni Pizza', description: 'A meat lover’s dream with generous pepperoni', price: 14.99, imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVwcGVyb25pJTIwcGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', tags: ['Non-Veg'] },
      { id: 'p3', name: 'Veggie Supreme', description: 'Loaded with fresh vegetables like bell peppers, onions, olives.', price: 15.99, imageUrl: 'https://images.unsplash.com/photo-1593560704563-f176a2eb61db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHZlZ2dpZSUyMHBpenphfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', tags: ['Vegetarian', 'Healthy'] },
    ]
  },
  '2': {
    name: 'Sushi Heaven',
    bannerUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3VzaGklMjByZXN0YXVyYW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://via.placeholder.com/100/ADD8E6/000000?Text=SH',
    rating: 4.8,
    deliveryTimeEstimate: '30-40 min',
    description: 'Authentic Japanese sushi made with the freshest seafood and traditional techniques. Experience the art of sushi.',
    menu: [
      { id: 's1', name: 'Salmon Nigiri', description: 'Fresh salmon over sushi rice', price: 5.00, imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', tags: ['Popular', 'Raw'] },
      { id: 's2', name: 'California Roll', description: 'Crab, avocado, and cucumber', price: 7.50, imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FsaWZvcm5pYSUyMHJvbGx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', tags: ['Cooked'] },
      { id: 's3', name: 'Spicy Tuna Roll', description: 'Tuna, spicy mayo, and cucumber', price: 8.00, imageUrl: 'https://images.unsplash.com/photo-1611141919999-a5962e3098c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BpY3klMjB0dW5hJTIwcm9sbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=300&q=60', tags: ['Spicy', 'Raw'] },
    ]
  },
  // Add more restaurants if needed
};

type Dish = typeof sampleRestaurantDetails['1']['menu'][0] & { quantity?: number };
type Restaurant = typeof sampleRestaurantDetails['1'];

const RestaurantMenuPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`RestaurantMenuPage loaded for restaurant ID: ${restaurantId}`);
    // Simulate API call
    setIsLoading(true);
    const timer = setTimeout(() => {
      const foundRestaurant = sampleRestaurantDetails[restaurantId as keyof typeof sampleRestaurantDetails] || null;
      setRestaurant(foundRestaurant);
      setIsLoading(false);
      if (!foundRestaurant) {
        console.error(`Restaurant with ID ${restaurantId} not found.`);
        // navigate('/not-found'); // Or show an inline message
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [restaurantId, navigate]);

  const handleAddToCart = (dishId: string) => {
    const dish = restaurant?.menu.find(d => d.id === dishId);
    if (dish) {
      setSelectedDish(dish);
      setQuantity(1); // Reset quantity
      setCustomizationOpen(true); // Open dialog for customization/confirmation
      console.log(`Dish ${dish.name} selected, opening customization dialog.`);
    }
  };

  const confirmAddToCart = () => {
    if (selectedDish) {
      console.log(`Adding ${quantity} of ${selectedDish.name} to cart.`);
      // Here you would typically dispatch an action to update a global cart state
      // For now, just log and close.
      // Example: addToCart({ ...selectedDish, quantity });
      setCustomizationOpen(false);
      setSelectedDish(null);
      // Optionally navigate to cart or show toast
    }
  };


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <Skeleton className="h-8 w-1/4 mb-4" /> {/* Breadcrumb */}
        <Skeleton className="w-full h-64 mb-6" /> {/* Banner */}
        <div className="flex items-center mb-6 space-x-4">
          <Skeleton className="h-24 w-24 rounded-full" /> {/* Avatar */}
          <div>
            <Skeleton className="h-8 w-64 mb-2" /> {/* Name */}
            <Skeleton className="h-4 w-48" /> {/* Description snippet */}
          </div>
        </div>
        <Skeleton className="h-10 w-1/3 mb-6" /> {/* Menu Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-72 w-full" />)} {/* Dish Cards */}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold">Restaurant Not Found</h2>
        <p className="text-gray-600">The restaurant you are looking for does not exist or is unavailable.</p>
        <Button onClick={() => navigate('/')} className="mt-4">Go to Homepage</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
       <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-700">FoodieFleet</Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/profile-orders" className="px-3 py-2 text-sm font-medium hover:text-green-600">Profile</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/cart" className="px-3 py-2 text-sm font-medium hover:text-green-600 flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-1" /> Cart
                </NavigationMenuLink>
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
              <BreadcrumbPage>{restaurant.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section aria-labelledby="restaurant-details-heading" className="mb-10">
          <h2 id="restaurant-details-heading" className="sr-only">Restaurant Details</h2>
          <AspectRatio ratio={16 / 6} className="bg-muted rounded-lg overflow-hidden mb-6">
            <img
              src={restaurant.bannerUrl || 'https://via.placeholder.com/1200x300?text=Restaurant+Banner'}
              alt={`${restaurant.name} banner`}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-24 w-24 border-4 border-white -mt-12 sm:mt-0 ml-4 sm:ml-0 shadow-lg">
              <AvatarImage src={restaurant.logoUrl} alt={`${restaurant.name} logo`} />
              <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              <p className="text-gray-600 mt-1 text-sm">{restaurant.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                {restaurant.rating && (
                  <Badge variant="outline" className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    {restaurant.rating.toFixed(1)}
                  </Badge>
                )}
                {restaurant.deliveryTimeEstimate && (
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-600 mr-1" />
                    {restaurant.deliveryTimeEstimate}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="menu-heading">
          <h2 id="menu-heading" className="text-2xl font-semibold mb-6">Menu</h2>
          <ScrollArea className="h-auto"> {/* Adjust height or let it flow naturally */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurant.menu.map(dish => (
                <DishCard
                  key={dish.id}
                  {...dish}
                  onAddToCart={() => handleAddToCart(dish.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </section>

        {selectedDish && (
          <Dialog open={customizationOpen} onOpenChange={setCustomizationOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{selectedDish.name}</DialogTitle>
                <DialogDescription>
                  {selectedDish.description} <br />
                  Price: ${selectedDish.price.toFixed(2)}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="flex items-center justify-center space-x-4">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
                    <MinusCircle className="h-5 w-5" />
                  </Button>
                  <span className="text-xl font-medium w-10 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)}>
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
                {/* Add more customization options here, e.g., checkboxes for add-ons */}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCustomizationOpen(false)}>Cancel</Button>
                <Button onClick={confirmAddToCart}>Add to Cart (${(selectedDish.price * quantity).toFixed(2)})</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-gray-600 border-t bg-white">
        Browse our delicious menu.
      </footer>
    </div>
  );
};

export default RestaurantMenuPage;