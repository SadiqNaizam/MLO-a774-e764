import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';

interface DishCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  tags?: string[]; // e.g., "Spicy", "Vegan"
  onAddToCart: (id: string) => void; // Simplified for now, could take quantity or open dialog
  // onCustomize?: (id: string) => void; // To open a customization dialog
}

const DishCard: React.FC<DishCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  tags,
  onAddToCart,
}) => {
  console.log(`Rendering DishCard: ${name}`);

  const handleAddToCartClick = () => {
    console.log(`Adding ${name} (id: ${id}) to cart.`);
    onAddToCart(id);
    // Potentially show toast notification
  };

  return (
    <Card className="w-full flex flex-col overflow-hidden">
      <CardHeader className="p-0 relative">
        <AspectRatio ratio={4 / 3}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={`Image of ${name}`}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
        {tags && tags.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-wrap gap-1">
            {tags.slice(0, 2).map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-1 flex-grow">
        <CardTitle className="text-md font-semibold">{name}</CardTitle>
        {description && (
          <p className="text-xs text-gray-500 line-clamp-2" title={description}>
            {description}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-lg font-bold text-green-700">${price.toFixed(2)}</span>
        <Button size="sm" onClick={handleAddToCartClick}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DishCard;