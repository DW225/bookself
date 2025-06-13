import { useState } from 'react';
import type { MetaFunction } from "@remix-run/node";
import { Plus } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { SearchBar } from '~/components/bookshelf/SearchBar';
import { FilterDropdown } from '~/components/bookshelf/FilterDropdown';
import { SortDropdown } from '~/components/bookshelf/SortDropdown';
import { BookList } from '~/components/bookshelf/BookList';
import { SelectionToolbar } from '~/components/bookshelf/SelectionToolbar';
import { AddBookModal } from '~/components/bookshelf/AddBookModal';
import { useBookFilters } from '~/hooks/useBookFilters';
import { allMockBooks } from '~/data/mockBooks';
import type { Book } from '~/types/book';

export const meta: MetaFunction = () => {
  return [
    { title: "My Bookshelf" },
    { name: "description", content: "Organize and manage your book collection" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

export default function Index() {
  const [books, setBooks] = useState(allMockBooks);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
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
  } = useBookFilters(books);

  const handleBookClick = (book: Book) => {
    console.log('Book clicked:', book);
    // TODO: Navigate to book details or open modal
  };

  const handleAddBook = (bookData: Omit<Book, 'id' | 'dateAdded'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0],
    };
    
    setBooks(prevBooks => [newBook, ...prevBooks]);
    console.log('Book added:', newBook);
  };

  const handleBulkEdit = () => {
    console.log('Bulk edit:', Array.from(selectedBooks));
    // TODO: Open bulk edit modal
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete:', Array.from(selectedBooks));
    // TODO: Show confirmation dialog and delete books
  };

  const handleBulkTag = () => {
    console.log('Bulk tag:', Array.from(selectedBooks));
    // TODO: Open bulk tag modal
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Bookshelf</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
            Organize and manage your book collection
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
          {/* Top row - Search and Add button */}
          <div className="flex gap-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by title, author, genre, or tags..."
            />
            <Button 
              onClick={() => setIsAddModalOpen(true)} 
              className="flex-shrink-0 h-10 px-3 sm:px-4"
              size="default"
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Book</span>
            </Button>
          </div>
          
          {/* Bottom row - Filters and Sort */}
          <div className="flex gap-2 justify-end">
            <FilterDropdown
              filters={filters}
              onFilterChange={updateFilter}
            />
            <SortDropdown
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>

        {/* Selection Toolbar */}
        <div className="mb-4">
          <SelectionToolbar
            selectedCount={selectedBooks.size}
            onSelectAll={selectAllBooks}
            onClearSelection={clearSelection}
            onBulkEdit={handleBulkEdit}
            onBulkDelete={handleBulkDelete}
            onBulkTag={handleBulkTag}
          />
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredAndSortedBooks.length} of {books.length} books
        </div>

        {/* Book List */}
        <BookList
          books={filteredAndSortedBooks}
          selectedBooks={selectedBooks}
          onBookSelection={toggleBookSelection}
          onBookClick={handleBookClick}
        />

        {/* Add Book Modal */}
        <AddBookModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddBook={handleAddBook}
        />
      </div>
    </div>
  );
}