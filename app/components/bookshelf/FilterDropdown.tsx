import { Filter } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '~/components/ui/dropdown-menu';
import type { BookFilters } from '~/types/book';

interface FilterDropdownProps {
  filters: BookFilters;
  onFilterChange: (filterType: keyof BookFilters, values: string[] | number[]) => void;
}

const statusOptions = [
  { value: 'unread', label: 'Unread' },
  { value: 'reading', label: 'Currently Reading' },
  { value: 'completed', label: 'Completed' },
  { value: 'wishlist', label: 'Wishlist' },
];

const formatOptions = [
  { value: 'physical', label: 'Physical' },
  { value: 'ebook', label: 'E-book' },
  { value: 'audiobook', label: 'Audiobook' },
];

const ratingOptions = [
  { value: 5, label: '5 Stars' },
  { value: 4, label: '4 Stars' },
  { value: 3, label: '3 Stars' },
  { value: 2, label: '2 Stars' },
  { value: 1, label: '1 Star' },
];

export function FilterDropdown({ filters, onFilterChange }: FilterDropdownProps) {
  const activeFilterCount = Object.values(filters).reduce(
    (count, filterArray) => count + filterArray.length,
    0
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        {statusOptions.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={filters.status.includes(option.value)}
            onCheckedChange={(checked) => {
              const newValues = checked
                ? [...filters.status, option.value]
                : filters.status.filter((v) => v !== option.value);
              onFilterChange('status', newValues);
            }}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Filter by Format</DropdownMenuLabel>
        {formatOptions.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={filters.format.includes(option.value)}
            onCheckedChange={(checked) => {
              const newValues = checked
                ? [...filters.format, option.value]
                : filters.format.filter((v) => v !== option.value);
              onFilterChange('format', newValues);
            }}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Filter by Rating</DropdownMenuLabel>
        {ratingOptions.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={filters.rating.includes(option.value)}
            onCheckedChange={(checked) => {
              const newValues = checked
                ? [...filters.rating, option.value]
                : filters.rating.filter((v) => v !== option.value);
              onFilterChange('rating', newValues);
            }}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}