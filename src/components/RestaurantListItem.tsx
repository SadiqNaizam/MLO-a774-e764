import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Star } from 'lucide-react'; // Example icon

interface RestaurantListItemProps {
  id: string;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating?: number; // Optional rating
  deliveryTimeEstimate?: string; // e.g., "25-35 min"
  onClick?: (id: string) => void;
}

const RestaurantListItem: React.FC<RestaurantListItemProps> = ({
  id,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  deliveryTimeEstimate,
  onClick,
}) => {
  console.log(`Rendering RestaurantListItem: ${name}`);

  return (
    <Card
      className="w-full overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={() => onClick && onClick(id)}
    >
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={`Image of ${name}`}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <h3 className="text-lg font-semibold truncate" title={name}>{name}</h3>
        <div className="text-sm text-gray-600 truncate">
          {cuisineTypes.join(', ')}
        </div>
        <div className="flex items-center justify-between text-sm">
          {rating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
          {deliveryTimeEstimate && (
            <Badge variant="outline">{deliveryTimeEstimate}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantListItem;