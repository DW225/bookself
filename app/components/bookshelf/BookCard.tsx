import { Star, Calendar, BookOpen, Headphones, Tablet } from 'lucide-react';
import { Checkbox } from '~/components/ui/checkbox';
import type { Book } from '~/types/book';
import { cn } from '~/lib/utils';

interface BookCardProps {
  book: Book;
  isSelected: boolean;
  onSelectionChange: (bookId: string) => void;
  onClick?: (book: Book) => void;
}

const statusColors = {
  unread: 'bg-gray-100 text-gray-800',
  reading: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  wishlist: 'bg-purple-100 text-purple-800',
};

const formatIcons = {
  physical: BookOpen,
  ebook: Tablet,
  audiobook: Headphones,
};

export function BookCard({ book, isSelected, onSelectionChange, onClick }: BookCardProps) {
  const FormatIcon = formatIcons[book.format];

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on checkbox
    if ((e.target as HTMLElement).closest('[data-checkbox]')) {
      return;
    }
    onClick?.(book);
  };

  return (
    <div
      className={cn(
        "group relative rounded-lg border bg-card p-3 sm:p-4 transition-all duration-200 hover:shadow-md cursor-pointer",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div data-checkbox className="flex-shrink-0 pt-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelectionChange(book.id)}
          />
        </div>
        
        {book.coverUrl && (
          <div className="flex-shrink-0">
            <img
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              className="h-16 w-12 sm:h-20 sm:w-14 rounded object-cover"
            />
          </div>
        )}
        
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-card-foreground line-clamp-2 text-sm sm:text-base">
                {book.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                by {book.author}
              </p>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <FormatIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-medium",
                  statusColors[book.status]
                )}
              >
                {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(book.dateAdded).toLocaleDateString()}
            </span>
            
            {book.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{book.rating}/5</span>
              </div>
            )}
            
            <span className="capitalize">{book.genre}</span>
          </div>
          
          {book.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {book.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
              {book.tags.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{book.tags.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}