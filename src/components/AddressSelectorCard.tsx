import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroupItem } from '@/components/ui/radio-group'; // Assuming used within a RadioGroup
import { Edit2, Trash2 } from 'lucide-react';

interface Address {
  id: string;
  type?: string; // e.g., "Home", "Work"
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface AddressSelectorCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const AddressSelectorCard: React.FC<AddressSelectorCardProps> = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  console.log(`Rendering AddressSelectorCard for address ID: ${address.id}, selected: ${isSelected}`);

  return (
    <Card className={`w-full transition-all ${isSelected ? 'border-green-500 ring-2 ring-green-500' : 'hover:shadow-md'}`}>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
             {/* Assuming this card is part of a RadioGroup for selection */}
            <RadioGroupItem value={address.id} id={`addr-${address.id}`} checked={isSelected} onClick={() => onSelect(address.id)} aria-label={`Select address ${address.line1}`} />
            <CardTitle className="text-base cursor-pointer" onClick={() => onSelect(address.id)}>
              {address.type || 'Address'}
            </CardTitle>
          </div>
          <div className="flex space-x-1">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={() => onEdit(address.id)} aria-label="Edit address">
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={() => onDelete(address.id)} aria-label="Delete address" className="text-red-500 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-gray-700 px-4 pb-4 cursor-pointer" onClick={() => onSelect(address.id)}>
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>{`${address.city}, ${address.state} ${address.zip}`}</p>
        <p>{address.country}</p>
      </CardContent>
    </Card>
  );
};

export default AddressSelectorCard;