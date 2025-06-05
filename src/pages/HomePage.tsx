import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantListItem from '@/components/RestaurantListItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { Search, Filter } from 'lucide-react';

// Sample data
const sampleRestaurants = [
  { id: '1', name: 'Pizza Palace', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Pizza', 'Italian'], rating: 4.5, deliveryTimeEstimate: '25-35 min' },
  { id: '2', name: 'Sushi Heaven', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Sushi', 'Japanese'], rating: 4.8, deliveryTimeEstimate: '30-40 min' },
  { id: '3', name: 'Burger Barn', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Burgers', 'American'], rating: 4.2, deliveryTimeEstimate: '20-30 min' },
  { id: '4', name: 'Curry Corner', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a0586276d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aW5kaWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Indian', 'Curry'], deliveryTimeEstimate: '35-45 min' },
];

const cuisineCategories = ['All', 'Pizza', 'Sushi', 'Burgers', 'Indian', 'Healthy', 'Vegan'];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [filteredRestaurants, setFilteredRestaurants] = useState(sampleRestaurants);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('HomePage loaded');
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let restaurants = sampleRestaurants;
    if (selectedCategory !== 'All') {
      restaurants = restaurants.filter(r => r.cuisineTypes.includes(selectedCategory));
    }
    if (searchTerm) {
      restaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisineTypes.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredRestaurants(restaurants);
  }, [searchTerm, selectedCategory]);

  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-700">FoodieFleet</h1>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className="px-3 py-2 text-sm font-medium hover:text-green-600">Home</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/profile-orders" className="px-3 py-2 text-sm font-medium hover:text-green-600">Profile</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/cart" className="px-3 py-2 text-sm font-medium hover:text-green-600">Cart</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section aria-labelledby="search-and-filter-heading" className="mb-8">
          <h2 id="search-and-filter-heading" className="sr-only">Search and Filter Restaurants</h2>
          <div className="relative mb-6">
            <Input
              type="search"
              placeholder="Search restaurants or dishes (e.g., 'Pizza Palace', 'sushi')"
              className="pl-10 pr-4 py-3 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search restaurants or dishes"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Filter className="h-5 w-5 text-gray-600 mr-1 shrink-0" />
            {cuisineCategories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        <section aria-labelledby="restaurant-listings-heading">
          <h2 id="restaurant-listings-heading" className="text-2xl font-semibold mb-6">
            {selectedCategory === 'All' ? 'Popular Restaurants' : `${selectedCategory} Restaurants`}
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-[180px] w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <ScrollArea className="h-auto"> {/* Adjust height as needed or remove for natural flow */}
              {filteredRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRestaurants.map(restaurant => (
                    <RestaurantListItem
                      key={restaurant.id}
                      {...restaurant}
                      onClick={handleRestaurantClick}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 py-10">No restaurants found matching your criteria. Try a different search or category.</p>
              )}
            </ScrollArea>
          )}
        </section>
      </main>

      <footer className="py-6 text-center text-sm text-gray-600 border-t bg-white">
        © {new Date().getFullYear()} FoodieFleet. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;