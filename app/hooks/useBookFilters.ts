import { useState, useMemo } from 'react';
import type { Book, BookFilters, SortOption } from '~/types/book';

export function useBookFilters(books: Book[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('title-asc');
  const [filters, setFilters] = useState<BookFilters>({
    status: [],
    genre: [],
    format: [],
    rating: [],
  });
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());

  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.genre.toLowerCase().includes(query) ||
          book.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.status.length > 0) {
      result = result.filter(book => filters.status.includes(book.status));
    }

    if (filters.genre.length > 0) {
      result = result.filter(book => filters.genre.includes(book.genre));
    }

    if (filters.format.length > 0) {
      result = result.filter(book => filters.format.includes(book.format));
    }

    if (filters.rating.length > 0) {
      result = result.filter(book => 
        book.rating && filters.rating.includes(book.rating)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'author-asc':
          return a.author.localeCompare(b.author);
        case 'author-desc':
          return b.author.localeCompare(a.author);
        case 'date-added-asc':
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        case 'date-added-desc':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'rating-asc':
          return (a.rating || 0) - (b.rating || 0);
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [books, searchQuery, sortBy, filters]);

  const toggleBookSelection = (bookId: string) => {
    const newSelection = new Set(selectedBooks);
    if (newSelection.has(bookId)) {
      newSelection.delete(bookId);
    } else {
      newSelection.add(bookId);
    }
    setSelectedBooks(newSelection);
  };

  const selectAllBooks = () => {
    setSelectedBooks(new Set(filteredAndSortedBooks.map(book => book.id)));
  };

  const clearSelection = () => {
    setSelectedBooks(new Set());
  };

  const updateFilter = (filterType: keyof BookFilters, values: string[] | number[]) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: values,
    }));
  };

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filters,
    updateFilter,
    selectedBooks,
    toggleBookSelection,
    selectAllBooks,
    clearSelection,
    filteredAndSortedBooks,
  };
}