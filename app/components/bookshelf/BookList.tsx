import { useState } from 'react';
import { BookCard } from './BookCard';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';
import type { Book } from '~/types/book';

interface BookListProps {
  books: Book[];
  selectedBooks: Set<string>;
  onBookSelection: (bookId: string) => void;
  onBookClick?: (book: Book) => void;
  itemsPerPage?: number;
}

export function BookList({ 
  books, 
  selectedBooks, 
  onBookSelection, 
  onBookClick,
  itemsPerPage = 20 
}: BookListProps) {
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage);
  
  const displayedBooks = books.slice(0, displayedCount);
  const hasNextPage = displayedCount < books.length;
  const isFetchingNextPage = false; // Since we're not actually fetching from server

  const fetchNextPage = () => {
    if (hasNextPage) {
      setDisplayedCount(prev => Math.min(prev + itemsPerPage, books.length));
    }
  };

  const { loadingRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-muted-foreground">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-lg font-medium">No books found</h3>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {displayedBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isSelected={selectedBooks.has(book.id)}
            onSelectionChange={onBookSelection}
            onClick={onBookClick}
          />
        ))}
      </div>
      
      {hasNextPage && (
        <div ref={loadingRef} className="flex justify-center py-4">
          <div className="text-sm text-muted-foreground">Loading more books...</div>
        </div>
      )}
    </div>
  );
}